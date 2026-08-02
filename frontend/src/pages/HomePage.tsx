import { useEffect, useState } from "react";
import { getEvents, getCategories } from "../services/events";
import type { Event } from "../types/event";
import { Navbar } from '../components/Navbar';
import { EventCard } from '../components/EventCard'
import type { Category } from "../types/event";
import { getDistanceKm } from "../utils/distance";

export function HomePage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryId, setCategoryId] = useState('');
    const [date,setDate] = useState('');
    const [nearMeEnabled, setNearMeEnabled] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [locationError, setLocationError] = useState('');

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        getEvents({ categoryId: categoryId || undefined, date: date || undefined}).then(setEvents).finally(() => setLoading(false));
    }, [categoryId, date]);

    const handleToggleNearMe = () => {
        if (nearMeEnabled) {
            setNearMeEnabled(false);
            return;
        }
        setLocationError('');
        navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
                setNearMeEnabled(true);
            }, () => {
                setLocationError('Konum izni verilmedi, yakınımdaki etkinlikler gösterilemiyor.');
            }
        );
    };

    const displayedEvents = nearMeEnabled && userLocation
    ? [...events]
        .filter((event) => getDistanceKm(userLocation.lat, userLocation.lon, event.latitude, event.longitude) <= 50)
        .sort((a, b) =>
            getDistanceKm(userLocation.lat, userLocation.lon, a.latitude, a.longitude) -
            getDistanceKm(userLocation.lat, userLocation.lon, b.latitude, b.longitude)
        )
    : events;

    return (
        <div className="min-h-screen bg-dark">
            <Navbar />
            <div className=" max-w-5xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-light mb-6">Etkinlikler</h1>
                <div className="flex gap-3 mb-6 items-center flex-wrap">
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="bg-surface/40 border border-light/20 text-light rounded-lg px-4 py-2 focus:otuline-none focus:border-purple">
                        <option value="" className="bg-dark">Tüm Kategoriler</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}  className="bg-dark">{c.name}</option>
                        ))}
                    </select>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-surface/40 border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple" />
                    <button onClick={handleToggleNearMe} className={`text-sm px-4 py-2 rounded-lg border transition ${nearMeEnabled ? 'bg-purple text-light border-purple' : 'bg-surface/40 text-light/80 border-light/20 hover:border-purple'}`}>
                        📍 Yakınımdaki Etkinlikler
                    </button>
                    {(categoryId || date) && (
                        <button onClick={() => {setCategoryId(''); setDate(''); }} className="text-light/60 text-sm hover:text-yellow transition">Filtreleri Temizle</button>
                    )}
                </div>
                {locationError && <p className="text-yellow text-sm mb-4">{locationError}</p>}
                {loading ? (
                    <p className="text-light/60">Yükleniyor...</p>
                ): (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {displayedEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}