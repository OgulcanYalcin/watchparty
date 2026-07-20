import { useEffect, useState } from "react";
import { getMyProfile, updateProfile } from "../services/users";
import type { MyProfile } from "../types/user";
import { Navbar } from "../components/Navbar";

export function ProfilePage() {
    const [profile, setProfile] = useState<MyProfile | null>(null);
    const [biography, setBiography] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        getMyProfile().then((data) => {
            setProfile(data);
            setBiography(data.biography ?? '');
        });
    }, []);

    const handleSave= async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const updated = await updateProfile({ biography});
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
                <h1 className="text-2xl font-bold text-light mb-2">{profile.name}</h1>
                <p className="text-purple font-medium mb-6">İtibar Puanı: {profile.reputationScore}</p>
                <form onSubmit={handleSave} className="flex flex-col gap-3">
                    <label className="text-light/60 text-sm">Biyografi</label>
                    <textarea value={biography} onChange={(e) => setBiography(e.target.value)}
                        className="bg-surface/40 border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple" rows={4}/>
                    <button type="submit" className="bg-yellow text-dark font-semibold rounded-lg px-6 py-2 hover:opacity-90 transition self-start">Kaydet</button>
                    {message && <p className="text-purple text-sm">{message}</p>}    
                </form>
            </div>
        </div>
    );
}