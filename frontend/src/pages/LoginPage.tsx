import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';
import { useAuth } from '../store/AuthContext';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const result = await login({
                email, password
            });
            setAuth(result.accessToken);
            navigate('/');
        } catch {
            setError('E-posta veya şifre hatalı');
        }
    };

    return (
        <div className='min-h-screen bg-dark flex items-center justify-center px-4'>
            <form onSubmit={handleSubmit} className='bg-black/40 border border-purple/30 rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4'>
                <h1 className='text-3xl font-bold text-purple text-center mb-2'>
                    Watch Party
                </h1>
                <p className='text-light/60 text-center text-sm mb-4'>Giriş yap</p>
                {error && (
                    <p className='text-yellow text-sm text-center'>{error}</p>
                )}
                <input type='email' placeholder='E-posta' value={email} onChange={(e) => setEmail(e.target.value)} className='bg-dark border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple' required/>
                <input type='password' placeholder='Şifre' value={password} onChange={(e) => setPassword(e.target.value)} className='bg-dark border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple' required/>
                <button type="submit" className='bg-yellow text-dark font-semibold rounded-lg py-2 mt-2 hover:opacity-90 transition'>
                    Giriş Yap
                </button>
                <p className='text-light/60 text-sm text-center mt-2'>
                  Hesabın yok mu?{' '}
                  <Link to="/register" className='text-purple font-medium'>Kayıt ol
                  </Link>
                </p>
            </form>
        </div>
    );
}