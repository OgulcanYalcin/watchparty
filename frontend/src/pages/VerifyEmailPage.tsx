import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail } from "../services/auth";

export function VerifyEmailPage() {
    const location = useLocation();
    const email = (location.state as { email?: string} | null)?.email ?? '';
    const [code, setCode] = useState('');
    const [error , setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try{
            await verifyEmail({ email, code });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 1500);
        } catch {
            setError('Kod geçersiz veya süresi dolmuş.');
        }
    };

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center px-4">
            <form onSubmit={handleSubmit} className="bg-surface/40 border border-purple/30 rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-purple text-center mb-2">Watch Party</h1>
                <p className="text-light/60 text-center text-sm mb-4">{email ? `${email} adresine gönderdiğimiz 6 haneli kodu gir` : 'E-posta doğrulama kodunu gir'}</p>
                {error && <p className="text-yellow text-sm text-center">{error}</p>}
                {success && (
                    <p className="text-yellow text-sm text-center">E-posta doğrulandı! Giriş sayfasına yönlendiriliyorsun...</p>
                )}
                <input type="text" placeholder="6 haneli kod" value={code} onChange={(e) => setCode(e.target.value)} className="bg-dark border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple text-center tracking-widest text-lg" required maxLength={6} />
                <button type="submit" className="bg-yellow text-dark font-semibold rounded-lg py-2 mt-2 hover:opacity-90 transition">Doğrula</button>
            </form>
        </div>
    );
}