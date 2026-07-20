import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getMyParticipations } from "../services/participation";
import type { MyParticipation } from "../services/participation";
import { Navbar } from "../components/Navbar";

const statusLabels: Record<string, string> = {
    PENDING: 'Beklemede',
    APPROVED: 'Onaylandı',
    REJECTED: 'Reddedildi',
    CANCELLED: 'İptal Edildi',
};
const statusColors: Record<string, string> = {
    PENDING: 'text-yellow',
    APPROVED: 'text-purple',
    REJECTED: 'text-red-400',
    CANCELLED: 'text-light/40',
};

export function MyParticipationsPage() {
    const [participations, setParticipations] = useState<MyParticipation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyParticipations().then(setParticipations).finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-dark">
            <Navbar />
            <div className="max-w-2xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-light mb-6">Katılım İsteklerim</h1>
                {loading ? (
                    <p className="text-light/60">Yükleniyor...</p>
                ): participations.length === 0 ? (
                    <p className="text-light/60">Henüz bir etkinliğe katılım isteği göndermedin</p>
                ): (
                    <div className="flex flex-col gap-3">
                        {participations.map((p) => (
                            <Link key={p.id} to={`/events/${p.event.id}`} className="bg-surface/40 border border-purple/20 rounded-xl p-4 flex items-center justify-between hover:border-purple transition">
                                <div>
                                    <p className="text-light font-medium">{p.event.title}</p>
                                    <p className="text-light/50 text-xs mt-1">{new Date(p.event.date).toLocaleString('tr-TR')} · {p.event.address}</p>
                                </div>
                                <span className={`text-sm font semibold ${statusColors[p.requestStatus]}`}>{statusLabels[p.requestStatus]}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}