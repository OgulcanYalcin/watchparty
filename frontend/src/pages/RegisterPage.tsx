import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/auth';

export function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await register({ name, email, password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 1500);
        } catch {
            setError('Kayıt oluşturulamadı, bilgileri kontrol et');
        }
    };

    return (
        <div className='min-h-screen bg-dark flex items-center justify-center px-4'>
            <form onSubmit={handleSubmit} className='bg-black/40 border border-purple/30 rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4'>
            <h1 className='text-3xl font-bold text-purple text-center mb-2'>
                Watch Party
            </h1>
            <p className='text-light/60 text-center text-sm mb-4'>Hesap oluştur</p>
            {error && <p className='text-yellow text-sm text-center'>{error}</p>}
            {success && (
                <p className='text-yellow text-sm text-center'>
                    Kayıt başarılı! Giriş sayfasına yönlendiriliyorsun...
                </p>
            )}
            <input type='text' placeholder='Ad Soyad' value={name} onChange={(e) => setName(e.target.value)} className='bg-dark border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple' required/>
            <input type='email' placeholder='E-posta' value={email} onChange={(e) => setEmail(e.target.value)} className='bg-dark border border-light/20 text-light rounded-lg px-4 py-2 focus: outline-none focus:border-purple' required/>
            <input type='password' placeholder='şifre' value={password} onChange={(e) => setPassword(e.target.value)} className='bg-dark border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple' required minLength={6}/>
            <button type='submit' className='bg-yellow text-dark font-semibold rounded-lg py-2 mt-2 hover:opacity-90 transition'>Kayıt Ol
            </button>
            <p className='text-light/60 text-sm text-center mt-2'>Zaten hesabın var mı{''}
                <Link to ="/login" className='text-purple font-medium'>Giriş yap
                </Link>
            </p>
            </form>
        </div>
    )
}