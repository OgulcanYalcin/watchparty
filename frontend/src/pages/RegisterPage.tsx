import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, getUserCount } from '../services/auth';
import { useTheme } from '../store/ThemeContext';
import { RainbowBackground } from '../components/RainbowBackground';

function getPasswordStrength(password: string){
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if(/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: 'Zayıf', color: 'bg-red-500', width: 'w-1/3' };
    if (score <=3 ) return { label: 'Orta', color: 'bg-yellow', width: 'w-2/3'};
    return { label: 'Güçlü', color: 'bg-green-500', width: 'w-full' };
}

export function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [userCount, setUserCount] = useState<number | null>(null);
    const {theme} = useTheme();
    const navigate = useNavigate();
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        getUserCount().then((data) => setUserCount(data.count)).catch(() => {});
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setNameError('');
        setEmailError('');
        setPasswordError('');
        let hasError = false;
        if (!name.trim()) {
            setNameError('İsim boş bırakılamaz');
            hasError = true;
        }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError('Geçerli bir e-posta adresi gir');
            hasError = true;
        }
        if(password.length < 6) {
            setPasswordError('Şifre en az 6 karakter olmalı');
            hasError = true;
        }
        if (hasError) return;
        try {
            await register({ name, email, password });
            setSuccess(true);
            setTimeout(() => navigate('/verify-email', { state: {email }}), 1500);
        } catch (err) {
            const axiosError = err as { response?: { status?: number } };
            if (axiosError.response?.status === 409) {
                setEmailError('Bu e-posta adresi zaten kayıtlı');
            } else {
                setError('Kayıt oluşturulamadı, bilgileri kontrol et');
            }
        }
    };

    return (
        <div className="min-h-screen bg-dark relative overflow-hidden flex items-center justify-center px-4">
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
        <div className="relative z-10 w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
            <div className="hidden lg:flex flex-col justify-center text-center lg:text-left px-6">
                <h1 className="text-4xl font-bold text-purple mb-4">Watch Party</h1>
                <p className="text-light/70 text-lg mb-6">
                    Dizi, film ve spor etkinlikleri için buluşma organize et, yeni insanlarla tanış.
                </p>
                {userCount !== null && (
                    <p className="text-yellow font-semibold">
                        {userCount}+ kullanıcı zaten Watch Party'de!
                    </p>
                )}
            </div>

            
            <form onSubmit={handleSubmit} className='bg-surface/40 border border-purple/30 rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4'>
            <h1 className='text-3xl font-bold text-purple text-center mb-2'>
                Watch Party
            </h1>
            <p className='text-light/60 text-center text-sm mb-4'>Hesap oluştur</p>
            {error && <p className='text-yellow text-sm text-center'>{error}</p>}
            {success && (
                <p className='text-yellow text-sm text-center'>
                    Kayıt başarılı! Doğrulama sayfasına yönlendiriliyorsun...
                </p>
            )}
            <div>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light/40">👤</span>
                <input type="text" placeholder="Ad Soyad" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-dark border border-light/20 text-light rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-purple" required/>
            </div>
            {nameError && <p className="text-red-400 text-xs mt-1">{nameError}</p>}
        </div>

        <div>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light/40">📧</span>
                <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-dark border border-light/20 text-light rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-purple" required/>
            </div>
            {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
        </div>

        <div>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light/40">🔒</span>
                <input type={showPassword ? 'text' : 'password'} placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-dark border border-light/20 text-light rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:border-purple" required minLength={6}/>
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-light/40 hover:text-light transition">
                    {showPassword ? '🙈' : '👁️'}
                </button>
            </div>
            {password && (
                <div className="mt-2">
                    <div className="h-1.5 bg-dark rounded-full overflow-hidden">
                        <div className={`h-full ${getPasswordStrength(password).color} ${getPasswordStrength(password).width} transition-all`}></div>
                    </div>
                    <p className="text-xs text-light/50 mt-1">{getPasswordStrength(password).label}</p>
                </div>
            )}
            {passwordError && <p className="text-red-400 text-xs mt-1">{passwordError}</p>}
        </div>
                    <button type='submit' className='bg-yellow text-dark font-semibold rounded-lg py-2 mt-2 hover:opacity-90 transition'>Kayıt Ol
                    </button>
                    <p className='text-light/60 text-sm text-center mt-2'>Zaten hesabın var mı{''}
                        <Link to ="/login" className='text-purple font-medium'>Giriş yap
                        </Link>
                    </p>
                    </form>
                    
                </div>
    </div>

    )
}