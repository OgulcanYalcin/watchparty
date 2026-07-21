import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useEffect, useState } from 'react';
import { getMyProfile } from '../services/users';
import { useTheme } from '../store/ThemeContext';
import { getNotifications } from '../services/notification';

export function Navbar() {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
      getMyProfile().then((profile) => setIsAdmin(profile.role === 'ADMIN')).catch(() => {});
    }, []);
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
      getNotifications().then((notifictions) => {
        setUnreadCount(notifictions.filter((n) => !n.isRead).length);
      }).catch(() => {});
    }, []);

    return (
        <nav className='bg-surface/60 border-b border-purple/20 px-6 py-4 flex items-center justify-between'>
            <Link to="/" className='text-xl font-bold text-purple'>
              Watch Party
            </Link>
            <div className='flex items-center gap-6'>
              <Link to="/" className='text-light/80 hover:text-yellow transition'>
              Etkinlikler
              </Link>
              <Link to="/profile" className='text-light/80 hover:text-yellow transition text-xl'>
              👤
              </Link>
              <Link to="/notifications" className='relative text-light/80 hover:text-yellow transition text-xl'>
              🔔
                {unreadCount > 0 && (
                  <span className='absolute -top-2 -right-2 bg-yellow text-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>{unreadCount}</span>
                )} 
              </Link>
              <Link to="/my-participations" className='text-light/80 hover:text-yellow transition'>
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
              <button onClick={toggleTheme} className='text-light/80 hover:text-yellow transition'>
                  {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button onClick={handleLogout} className='bg-yellow text-dark font-semibold px-4 py-1.5 rounded-lg hover:opacity-90 transition'>
                Çıkış
              </button>
            </div>
        </nav>
    );
}