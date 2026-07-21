import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { EventDetailPage } from './pages/EventDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { CreateEventPage } from './pages/CreateEventPage'
import { AdminPage } from './pages/AdminPage';
import { MyParticipationsPage } from './pages/MyParticipationsPage';
import { useAuth } from './store/AuthContext';
import { LandingPage } from './pages/LandingPage';

function App() {
  return (
    <Routes>
      <Route path='/my-participations' element={<ProtectedRoute><MyParticipationsPage/></ProtectedRoute>}/>
      <Route path='/admin' element={<ProtectedRoute><AdminPage /></ProtectedRoute>}/>
      <Route path="/events/new" element={<ProtectedRoute><CreateEventPage/></ProtectedRoute>} />
      <Route path='/notifications' element= {<ProtectedRoute><NotificationsPage/></ProtectedRoute>} />
      <Route path="/" element= {<HomeRoute/>}/>
      <Route path="/login" element= {<LoginPage/>} />
      <Route path="/register" element= {<RegisterPage/>} />
      <Route path='/events/new' element= {<ProtectedRoute><CreateEventPage/></ProtectedRoute>}/>
      <Route path='/events/:id' element= {<ProtectedRoute><EventDetailPage/></ProtectedRoute>}/>
      <Route path='/profile' element= {<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
    </Routes>
  );
}

function HomeRoute() {
  const { token } = useAuth();
  return token? <HomePage /> : <LandingPage />;
}

export default App;