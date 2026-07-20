import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent, getCategories } from '../services/events'
import type { Category } from '../types/event';
import { Navbar } from '../components/Navbar'

export function CreateEventPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [capacity, setCapacity] = useState(5);
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongtitude] = useState('');
    const [placeId, setPlaceId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [joiningMode, setJoiningMode] = useState<'AUTOMATIC' | 'MANUAL'>('AUTOMATIC');
    const [isPaid, setIsPaid] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        getCategories().then((data) => {
            setCategories(data);
            if (data.length > 0) setCategoryId(data[0].id);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        
        e.preventDefault();
        if(isSubmitting == true) {
            return;
        }
        setError('');
        setIsSubmitting(true);
        try {
            const event = await createEvent({
                title,
                description: description || undefined,
                date: new Date(date).toISOString(),
                capacity: Number(capacity),
                address,
                latitude: Number(latitude),
                longitude: Number(longitude),
                placeId,
                categoryId,
                joiningMode,
                isPaid,
            });
            navigate(`/events/${event.id}`);
        }  catch{
            setError('Etkinlik oluşturulamadı, bilgileri kontrol et.');
        }  finally {
            setIsSubmitting(false);
            
        }
    };

    return (
        <div className='min-h-screen bg-dark'>
            <Navbar />
            <div className='max-w-xl mx-auto px-6 py-8'>
                <h1 className='text-2xl font-bold text-light mb-6'>Yeni Etkinlik Oluştur</h1>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    {error && <p className='text-yellow text-sm'>{error}</p>}
                    <div>
                        <label className='text-light/60 text-sm block mb-1'>Başlık</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className='w-full bg-surface/40 border border-light20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple' required />
                    </div>
                    <div>
                        <label className='text-light/60 text-sm block mb-1'>Açıklama</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='w-full bg-surface/40 border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple' rows={3}/>
                    </div>
                    <div>
                        <label className='text-light/60 text-sm block mb-1'>Tarih ve Saat</label>
                        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className='w-full bg-surface/40 border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple' required />
                    </div>
                    <div>
                        <label className='text-light/60 text-sm block mb-1'>Kategori</label>
                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className='w-full bg-surface/40 border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple' required>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id} className='bg-dark'>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className='text-light/60 text-sm block mb-1'>Adres</label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className='w-full bg-surface/40 border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple' required/>
                    </div>

                    <div className='flex gap-3'>
                        <div className='flex-1'>
                            <label className='text-light/60 text-sm block mb-1'>Enlem</label>
                            <input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} className='w-full bg-surface/40 border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple'required />
                        </div>
                        <div className='flex-1'>
                            <label className='text-light/60 text-sm block mb-1'>Boylam</label>
                            <input type="number" step="any" value={longitude} onChange={(e) => setLongtitude(e.target.value)} className='w-full bg-surface/40 border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple' required />
                        </div>
                    </div>

                    <div>
                        <label className='text-light/60 text-sm block mb-1'>Place ID</label>
                        <input type="text" value={placeId} onChange={(e) => setPlaceId(e.target.value)} className='w-full bg-surface/40 border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple' required/>
                    </div>
                    <div>
                        <label className='text-light/60 text-sm block mb-1'>Kapasite</label>
                        <input type="text" min={1} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className='w-full bg-surface/40 border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple' required />
                    </div>
                    <div>
                        <label className='text-light/60 text-sm block mb-1'>Onay Modu</label>
                        <select value={joiningMode} onChange={(e) => setJoiningMode(e.target.value as 'AUTOMATIC' | 'MANUAL')} className='w-full bg-surface/40 border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple'>
                            <option value="AUTOMATIC" className='bg-dark'>Otomatik</option>
                            <option value="MANUAL" className='bg-dark'>Manuel</option>
                        </select>
                    </div>

                    <label className='flex items-center gap-2 text-light/80 text-sm'>
                    <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} />Ücretli Etkinlik
                    </label>

                    <button type='submit' disabled={isSubmitting} className='bg-yellow text-dark font-semibold rounded-lg py-2 mt-2 hover:opacity-90 transition'>{isSubmitting? 'Oluşturuluyor...' : 'Etkinliği oluştur'}</button>
                </form>
            </div>
        </div>
    );
}