import { useEffect, useState } from "react";
import { getNotifications, markAsRead } from "../services/notification";
import type { Notification } from "../types/notification";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getNotifications()
            .then(setNotifications)
            .finally(() => setLoading(false));
    }, []);

    const handleMarkAsRead = async (id: string) => {
        const updated = await markAsRead(id);
        setNotifications((prev) => 
            prev.map((n) => (n.id === id ? updated : n)),
        );
    };

    const navigate = useNavigate();

    const handleClick = (n: Notification) => {
        if(!n.isRead) {
            handleMarkAsRead(n.id);
        }
        if(n.eventId) {
            navigate(`/events/${n.eventId}`);
        }
    }

    return (
        <div className="min-h-screen bg-dark">
            <Navbar  />
            <div className="max-w-2xl mx-auto px-6 py-8">
              <h1 className="text-2xl font-bold text-light mb-6">Bildirimler</h1>{loading ? (
                <p className="text-light/60">Yükleniyor...</p>
              ) : notifications.length === 0 ? (
                <p className="text-light/60">Hiç bildirimin yok.</p>
              ) : (
                <div className="flex flex-col gap-3">
                    {notifications.map((n) => (
                        <div key={n.id} onClick={() => handleClick(n)} className={`rounded-xl p-4 border cursor-pointer transition ${n.isRead ? 'bg-surface/20 border-light/10 text-light/50' : 'bg-surface/40 border-purple/40 text-light' }`}>
                            {n.event && (
                                <p className="text-purple text-sm font-semibold mb-1">{n.event.title}</p>
                            )}
                            <p>{n.text}</p>
                            <p className="text-xs text-light/40 mt-1">{new Date(n.createdAt).toLocaleString('tr-TR')}
                            </p>
                        </div>
                    ))}
                </div>
              )}
            </div>

        </div>
    );
}