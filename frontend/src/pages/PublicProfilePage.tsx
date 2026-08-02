import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../services/users";
import type { PublicProfile } from "../types/user";
import { Navbar } from "../components/Navbar";
import { formatRating } from "../utils/formatRating";

export function PublicProfilePage(){
    const { id } = useParams<{id: string}>();
    const [profile, setProfile] = useState<PublicProfile | null>(null);

    useEffect(() => {
        if (!id) return;
        getUserProfile(id).then(setProfile);
    }, [id]);

    if(!profile) {
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
                        ): (
                            <span className="text-4xl">👤</span>
                        )}
                    </div>
                    <h1 className="text-2xl font-bold text-light mb-2">{profile.name}</h1>
                    <p className="text-purple font-medium mb-1">Değerlendirme: {formatRating(profile.reputationScore)}</p>
                    <p className="text-light/60 text-sm mb-6">Üyelik Tarihi: {new Date(profile.createdAt).toLocaleDateString('tr-TR')}</p>
                    {profile.biography && (
                        <p className="text-light/80">{profile.biography}</p>
                    )}
                </div>
            </div>
        );
}