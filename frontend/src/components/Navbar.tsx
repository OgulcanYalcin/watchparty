import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useEffect, useState } from 'react';
import { getMyProfile } from '../services/users';

export function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
      getMyProfile().then((profile) => setIsAdmin(profile.role === 'ADMIN')).catch(() => {});
    }, []);
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className='bg-black/60 border-b border-purple/20 px-6 py-4 flex items-center justify-between'>
            <Link to="/" className='text-xl font-bold text-purple'>
              Watch Party
            </Link>
            <div className='flex items-center gap-6'>
              <Link to="/" className='text-light/80 hover:text-yellow transition'>
              Etkinlikler
              </Link>
              <Link to="/profile" className='text-light/80 hover:text-yellow transition'>
              Profilim
              </Link>
              <Link to="/notifications" className='text-light/80 hover:text-yellow transition'>
              Bildirimler
              </Link>
              <Link to="my-participations" className='text-light/80 hover:text-yellow transition'>
              Katılımlarım
              </Link>
              <Link to="/events/new" className='text-light/80 hover:text-yellow transition'>
              Etkinlik Oluştur
              </Link>
              {isAdmin && (
                <Link to="/admin" className='text-light/80 hover:text-yellow transition'>
                Admin Paneli
                </Link>
              )}
              <button onClick={handleLogout} className='bg-yellow text-dark font-semibold px-4 py-1.5 rounded-lg hover:opacity-90 transition'>
                Çıkış
              </button>
            </div>
        </nav>
    );
}