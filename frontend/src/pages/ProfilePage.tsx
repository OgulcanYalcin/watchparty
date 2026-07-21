import { useEffect, useState } from "react";
import { getMyProfile, updateProfile } from "../services/users";
import type { MyProfile } from "../types/user";
import { Navbar } from "../components/Navbar";
import { getMyParticipations } from "../services/participation";
import { getEvents } from "../services/events";

export function ProfilePage() {
    const [profile, setProfile] = useState<MyProfile | null>(null);
    const [biography, setBiography] = useState('');
    const [message, setMessage] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [stats, setStats] = useState({ participated: 0, hosted: 0 });

    useEffect(() => {
        getMyProfile().then((data) => {
            setProfile(data);
            setBiography(data.biography ?? '');
            setProfilePicture(data.profilePicture ?? '');
        });
    }, []);

    useEffect(() => {
        if(!profile) return;
        Promise.all([getMyParticipations(),getEvents()]).then(([participations, events]) => {
            const participated = participations.filter((p) => p.requestStatus ==='APPROVED').length;
            const hosted = events.filter((e) => e.createdById === profile.id).length;
            setStats({ participated, hosted });
        });
    }, [profile]);

    const handleSave= async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const updated = await updateProfile({ biography, profilePicture});
            setProfile(updated);
            setMessage('Profil güncellendi!');
        } catch {
            setMessage('Güncelleme başarısız');
        }
    };

    if (!profile) {
        return (
            <div className="min-h-screen bg-dark">
                <Navbar />
                <p className="text-light/60 text-center mt-10">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark">
            <Navbar />
            <div className="max-w-xl mx-auto px-6 py-8">
                <div className="w-24 h-24 rounded-full bg-surface/40 border border-purple/30 flex items-center justify-center overflow-hidden mb-4">
                    {profile.profilePicture ? (
                        <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover"/>
                    ) : (
                        <span className="text-4xl">👤</span>
                    )}
                </div>
                <h1 className="text-2xl font-bold text-light mb-2">{profile.name}</h1>
                <p className="text-purple font-medium mb-6">İtibar Puanı: {profile.reputationScore}</p>
                <p className="text-light/60 text-sm">{profile.email}</p>
                <p className="text-light/60 text-sm mb-6">Üyelik Tarihi: {new Date(profile.createdAt).toLocaleString('tr-TR')}</p>
                <div className="flex gap-6 mb-6">
                    <p className="text-light/80 text-sm">
                    <span className="text-purple font-semibold">{stats.participated}</span> Etkinliğe Katıldı
                    </p>
                    <p className="text-light/80 text-sm">
                    <span className="text-purple font-semibold">{stats.hosted}</span> Etkinlik Oluşturuldu</p>
                </div>
                <form onSubmit={handleSave} className="flex flex-col gap-3">
                    <label className="text-light/60 text-sm">Biyografi</label>
                    <label className="text-light/60 text-sm">Profil Fotoğrafı URL</label>
                    <input type="text" value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)} className="bg-surface/40 border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple" placeholder="https://..."/>
                    <textarea value={biography} onChange={(e) => setBiography(e.target.value)}
                        className="bg-surface/40 border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple" rows={4}/>
                    <button type="submit" className="bg-yellow text-dark font-semibold rounded-lg px-6 py-2 hover:opacity-90 transition self-start">Kaydet</button>
                    {message && <p className="text-purple text-sm">{message}</p>}    
                </form>
            </div>
        </div>
    );
}