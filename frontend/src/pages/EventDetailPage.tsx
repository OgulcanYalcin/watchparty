import { useEffect, useState, useRef} from "react";
import { useParams } from "react-router-dom";
import { cancelEvent, getEvent, participateInEvent, updateEvent } from "../services/events";
import { getMyProfile } from "../services/users";
import { approveParticipation, rejectParticipation, getParticipants } from "../services/participation";
import type { Event } from "../types/event";
import type { Participation } from "../types/participation";
import { Navbar } from "../components/Navbar";
import { useChat } from "../hooks/useChat";
import { getMessages } from "../services/chat";
import { Link } from "react-router-dom";

interface ParticipantWithUser extends Participation {
    user: {
        id: string;
        name: string;
        profilePicture: string | null;
        reputationScore: number;
    };
}

export function EventDetailPage() {
    const { id } = useParams<{ id: string}>();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isHost, setIsHost] = useState(false);
    const [participants, setParticipants] = useState<ParticipantWithUser[]>([]);
    const {messages, setMessages, error: chatError, sendMessage} = useChat(id ?? '');
    const [newMessage, setNewMessage] = useState('');
    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editAddress, setEditAddress] = useState('');
    const [editCapacity, setEditCapacity] = useState(0);
    const [editMessage, setEditMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth'});
    }, [messages]);

    useEffect(() => {
        if (!id) return;
        Promise.all([getEvent(id), getMyProfile()]).then(([eventData, profile]) => {
            setEvent(eventData);
            setIsHost(profile.id === eventData.createdBy.id);
            setLoading(false);
            if ( profile.id === eventData.createdBy.id) {
                getParticipants(id).then(setParticipants);
            }
        });
    }, [id]);

    const handleParticipate = async () => {
        if (!id) return;
        setMessage('');
        try {
            const result = await participateInEvent(id);
            setMessage(
                result.requestStatus === 'APPROVED'
                  ? 'Katılım isteğin onaylandı!'
                  : 'Katılım isteğin gönderildi, host onayını bekliyor.',
            );
        } catch {
            setMessage('Katılım isteği gönderilemedi.');
        }
    };

    const handleApprove = async ( participationId: string) => {
        const updated = await approveParticipation(participationId);
        setParticipants((prev) => 
          prev.map((p) => (p.id === participationId ? { ...p, ...updated } : p)),
        );
    };

    const handleReject = async (participationId: string)  => {
        const updated = await rejectParticipation(participationId);
        setParticipants((prev) => 
          prev.map((p) => (p.id === participationId ? { ...p, ...updated } : p)),
        );
    }
    
    useEffect(() => {
        if (!id) return;
        getMessages(id).then((history) => setMessages(history)).catch(() => {});
    }, [id]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        sendMessage(newMessage);
        setNewMessage('');
    };

    const openEdit = () => {
        if (!event) return;
        setEditTitle(event.title);
        setEditDescription(event.description ?? '');
        setEditDate(event.date.slice(0, 16));
        setEditAddress(event.address);
        setEditCapacity(Number((event.capacity)));
        setEditing(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !event) return;
        try {
            const updated = await updateEvent(id, {
                title: editTitle,
                description: editDescription,
                date: new Date(editDate).toISOString(),
                address: editAddress,
                capacity: editCapacity,
            });
            setEvent({ ...event, ...updated});
            setEditing(false);
            setEditMessage('Etkinlik güncellendi.');
        } catch {
            setEditMessage('Güncelleme başarısız');
        }
    };

    const handleCancelEvent = async() => {
        if (!id || !event) return;
        if (!window.confirm('Bu etkinliği iptal etmek istediğine emin misin?')) return;
        const updated = await cancelEvent(id);
        setEvent({ ...event, ...updated});
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark">
                <Navbar />
                <p className="text-light/60 text-center mt-10">Yükleniyor...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-dark">
                <Navbar />
                <p className="text-light/60 text-center mt-10">Etkinlik bulunamadı.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark">
            <Navbar />
            <div className="max-w-2xl mx-auto px-6 py-8">
                <span className="text-yellow text-xs font-semibold uppercase tracking-wide">{event.category.name}</span>
                <h1 className="text-3xl font-bold text-light mt-2">{event.title}</h1>
                <p className="text-light/60 mt-2">{event.description}</p>
                <div className="bg-surface/40 border border-purpler/20 rounded-xl p-5 mt-6 flex flex-col gap-2">
                    <p className="text-light">
                        <span className="text-purple font-medium">Adres:</span>
                        {event.address}
                    </p>
                    <p className="text-light">
                        <span className="text-purple font-medium">Kapasite:</span>
                        {event.capacity}
                    </p>
                    <p className="text-light">
                        <span className="text-purple font-medium">Host:</span>
                        <Link to={`/users/${event.createdBy.id}`} className="hover:text-yellow transition">
                        {event.createdBy.name}</Link> (itibar:{event.createdBy.reputationScore})
                    </p>
                    <p className="text-light">
                        <span className="text-purple font-medium">Onay Modu:</span>
                        {event.joiningMode === 'AUTOMATIC' ? 'Otomatik' : 'Manuel'}
                    </p>
                </div>
                {!isHost && (
                    <>
                        {event.status === 'CANCELLED' ? (
                            <p className="text-red-400 font-semibold mt-6">Bu etkinklik iptal edildi.</p>
                        ): (
                            <button onClick={handleParticipate} className="bg-yellow text-dark font-semibold rounded-lg px-6 py-2 mt-6 hover:opacity-90 transition">Katıl</button>
                        )}
                        {message && <p className="text-purple mt-4">{message}</p>}
                    </>
                )}

                {isHost && (
                    <div className="mt-8">
                        <div className="flex gap-3 mb-6">
                            <button onClick={openEdit} className="bg-transparent border border-purple text-purple text-sm font-semibold px-4 py-2 rounded-lg hover:bg-purple/10 transition">Düzenle</button>
                            {event.status !== 'CANCELLED' && (
                                <button onClick={handleCancelEvent} className="bg-transparent border border-yellow text-yellow text-sm font-semibold px-4 py-2 rounded-lg hover:bg-yellow/10 transition">Etkinliği İptal Et</button>
                            )}
                        </div>
                        {editing && (
                            <form onSubmit={handleUpdate} className="bg-surface/40 border border-purple/20 rounded-xl p-5 mb-6 flex flex-col gap-3">
                                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="bg-dark border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple" />
                                <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="bg-dark border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple" rows={3}/>
                                <input type="datetime-local" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="bg-dark border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple" />
                                <input type="text" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className="bg-dark border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple" />
                                <input type="number" value={editCapacity} onChange={(e) => setEditCapacity(Number(e.target.value))} className="bg-dark border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple" />
                                <div className="flex gap-2">
                                    <button type="submit" className="bg-yellow text-dark font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition">Kaydet</button>
                                    <button type="button" onClick={() => setEditing(false)} className="bg-transparent border border-light/30 text-light px-4 py-2 rounded-lg">Vazgeç</button>
                                </div>    
                            </form>
                        )}
                        {editMessage && <p className="text-purple mb*4">{editMessage}</p>}
                        <h2 className="text-xl font-bold text-light mb-4">Katılım İstekleri</h2>
                        {participants.length === 0 ? (
                            <p className="text-light/60">Henüz katılım isteği yok.</p>
                        ): (
                            <div className="flex flex-col gap-3">
                                {participants.map((p) => (
                                    <div key={p.id} className="bg-surface/40 border border-purple/20 rounded-xl p-4 flex items-center justify-between">
                                        <div>
                                            <Link to={`/users/${p.user.id}`} className="text-light font-medium hover:text-yellow transition">{p.user.name}</Link>
                                            <p className="text-light/50 text-xs">İtibar: {p.user.reputationScore} · Durum: {p.requestStatus}</p>
                                        </div>
                                        {p.requestStatus === 'PENDING' && (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleApprove(p.id)} className="bg-yellow text-dark text-sm font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition">Onayla</button>
                                                <button onClick={() => handleReject(p.id)} className="bg-transparent border border-light/30 text-light text-sm px-3 py-1.5 rounded-lg hover:border-yellow transition">Reddet</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-light mb-4">Sohbet</h2>
                    {chatError ? (
                        <p className="text-yellow">{chatError}</p>
                    ): (
                        <>
                            <div className="bg-surface/40 border border-purple/20 rounded-xl p-4 h-64 overflow-y-auto flex flex-col gap-2 mb-3">
                                {messages.map((m) => (
                                    <div key={m.id} className="text-sm">
                                        <Link to={`/users/${m.user.id}`} className="text-purple font-medium hover:text-yellow transition">{m.user.name}</Link>:
                                        <span className="text-light">{m.content}</span>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Mesaj yaz..." className="flex-1 bg-surface/40 border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple"/>
                                <button type="submit" className="bg-yellow text-dark font-semibold px-4 rounded-lg hover:opacity-90 transition">Gönder</button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}