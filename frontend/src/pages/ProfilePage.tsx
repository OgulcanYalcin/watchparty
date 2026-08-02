import { useEffect, useState } from "react";
import { getMyProfile, updateProfile } from "../services/users";
import type { MyProfile } from "../types/user";
import { Navbar } from "../components/Navbar";
import { getMyParticipations } from "../services/participation";
import { getEvents } from "../services/events";
import { useTheme } from "../store/ThemeContext";
import { RainbowBackground } from "../components/RainbowBackground";
import { formatRating } from "../utils/formatRating";

export function ProfilePage() {
    const [profile, setProfile] = useState<MyProfile | null>(null);
    const [biography, setBiography] = useState('');
    const [message, setMessage] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [stats, setStats] = useState({ participated: 0, hosted: 0 });
    const [editing, setEditing] = useState(false);
    const { theme } = useTheme();

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
            setEditing(false);
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

    const handleCancelEdit = () => {
        setBiography(profile?.biography ?? '');
        setProfilePicture(profile?.profilePicture ?? '');
        setEditing(false);
    };

    return (
        <div className="min-h-screen bg-dark relative overflow-hidden">
            {theme === 'dark' ? (
                <>
                    <div className="stars"></div>
                    <div className="shooting-star"></div>
                    <div className="shooting-star"></div>
                    <div className="shooting-star"></div>
                    <div className="shooting-star"></div>
                    <div className="shooting-star"></div>
                </>
            ) : (
                <RainbowBackground />
            )}

            <div className="relative <-10">
                <Navbar/>
                <div className="max-w-xl mx-auto px-6 py-8">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-32 h-32 rounded-full bg-surface/40 border-2 border-purple/40 flex items-center justify-center overflow-hidden mb-4">
                            {profile.profilePicture ? (
                                <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover"/>
                            ) : (
                                <span className="text-5xl">👤</span>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-light mb-1">{profile.name}</h1>
                        <p className="text-light/50 text-sm">{profile.email}</p>
                        <p className="text-light/40 text-xs mt-1">Üyelik Tarihi: {new Date(profile.createdAt).toLocaleDateString('tr-TR')}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-8">
                        <div className="bg-surface/40 border border-purple/20 rounded-xl p-4 text-center">
                            <p className={`font-bold text-yellow ${profile.reputationScore > 0 ? 'text-lg' : 'text-sm'}`}>{formatRating(profile.reputationScore)}</p>
                            <p className="text-light/50 text-xs mt-1">Değerlendirme</p>
                        </div>
                        <div className="bg-surface/40 border border-purple/20 rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-purple">{stats.participated}</p>
                            <p className="text-light/50 text-xs mt-1">Katıldığı Etkinlik</p>
                        </div>
                        <div className="bg-surface/40 border border-purple/20 rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-purple">{stats.hosted}</p>
                            <p className="text-light/50 text-xs mt-1">Oluşturduğu Etkinlik</p>
                        </div>
                    </div>

                    <div className="bg-surface/40 border border-purple/20 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-bold text-light">Hakkında</h2>
                            {!editing && (
                                <button onClick={() => setEditing(true)} className="text-purple text-sm font-semibold hover:text-yellow transition">
                                    Düzenle
                                </button>
                            )}
                        </div>
                        {!editing ? (
                            profile.biography ? (
                                <p className="text-light/80">{profile.biography}</p>
                            ) : (
                                <p className="text-light/40 text-sm italic">Henüz biyografi eklenmemiş.</p>
                            )
                        ) : (
                            <form onSubmit={handleSave} className="flex flex-col gap-3">
                                <div>
                                    <label className="text-light/60 text-sm block mb-1">Profil Fotoğrafı URL</label>
                                    <input type="text" value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)} className="w-full bg-dark border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple" placeholder="https://..."/>
                                </div>
                                <div>
                                    <label className="text-light/60 text-sm block mb-1">Biyografi</label>
                                    <textarea value={biography} onChange={(e) => setBiography(e.target.value)}
                                        className="w-full bg-dark border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple" rows={4}/>
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="bg-yellow text-dark font-semibold rounded-lg px-6 py-2 hover:opacity-90 transition">Kaydet</button>
                                    <button type="button" onClick={handleCancelEdit} className="bg-transparent border border-light/30 text-light px-6 py-2 rounded-lg hover:border-purple transition">Vazgeç</button>
                                </div>
                                {message && <p className="text-purple text-sm">{message}</p>}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}