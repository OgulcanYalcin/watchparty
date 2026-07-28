import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../services/events";
import { EventCard } from "../components/EventCard";
import type { Event } from "../types/event";


export function LandingPage() {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        getEvents().then(setEvents);
    }, []);

    return (
        <div className="min-h-screen bg-dark">
            <header className="flex items-center justify-between px-6 py-4 border-b border-purple/20">
                <span className="text-xl font-bold text-purple">
                    Watch Party
                </span>
                <div className="flex gap-4">
                    <Link to="/login" className="text-light/80 hover:text-yellow transition">Giriş Yap
                    </Link>
                    <Link to="/register" className="bg-yellow text-dark font-semibold px-4 py-1.5 rounded-lg hover:opacity-90 transition">Kayıt Ol
                    </Link>
                </div>
            </header>

            <section className="max-w-3xl mx-auto text-center px-6 py-20">
                <h1 className="text-4xl font-bold text-light mb-4">Birlikte İzle, Birlikte Yaşa</h1>
                <p className="text-light/60 text-lg mb-8">Dizi, film ve spor etkinlikleri için buluşma organize et, yeni insanlarla tanış. Katıl, sohbet et, birlikte deneyimle.</p>
                <div className="flex gap-4 justify-center">
                    <Link to="/register" className="bg-yellow text-dark font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition">Hemen Başla</Link>
                    <Link to="/login" className="border border-purple/40 text-light px-6 py-3 rounded-lg hover:border-purple transition">Giriş Yap</Link>
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-6 pb-16">
                <h2 className="text-2xl font-bold text-light mb-6">Tüm Etkinlikler</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} linkTo=""/>
                    ))}
                </div>
            </section>
        </div>
    )
}

