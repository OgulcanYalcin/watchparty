import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent, getCategories ,searchMedia, searchSports} from '../services/events'
import type { Category , MediaSearchResult } from '../types/event';
import { Navbar } from '../components/Navbar';
const KONSER_DEFAULT_IMAGE = 'https://www.izmirmekanrehberi.com/images/izmir-mekan-rehberi-izmir-en-iyi-konser-mekanlari-.jpg';
const ESPOR_DEFAULT_IMAGE = 'https://image.fanatik.com.tr/i/fanatik/75/1200x695/6251a36845d2a08840280c1a.jpg';


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
    const [imageUrl, setImageUrl] = useState('');
    const [mediaQuery, setMediaQuery] = useState('');
    const [mediaResults, setMediaResults] = useState<MediaSearchResult[]>([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        getCategories().then((data) => {
            setCategories(data);
            if (data.length > 0) setCategoryId(data[0].id);
        });
    }, []);

    const selectedCategoryName = categories.find((c) => c.id === categoryId)?.name.toLowerCase();
    const isMediaCategory = selectedCategoryName === 'dizi/film';
    const isSportsCategory = selectedCategoryName === 'spor';
    const isKonserCategory = selectedCategoryName === 'konser';
    const isEsporCategory = selectedCategoryName === 'e-spor';

    const handleSearchMedia = async () => {
        if (!mediaQuery.trim()) return;
        const results = isSportsCategory ? await searchSports(mediaQuery) : await searchMedia(mediaQuery);
        setMediaResults(results);
    }

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
                imageUrl: imageUrl || undefined,
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

                    <div>
                        <label className='text-light/60 text-sm block mb-1'>Kapak Görseli</label>
                        {(isMediaCategory || isSportsCategory) && (
                            <>
                                <div className='flex gap-2'>
                                    <input type="text" value={mediaQuery} onChange={(e) => setMediaQuery(e.target.value)} placeholder={isSportsCategory ? "Takım adı yaz..." : "Dizi/film adı yaz..."} className='flex-1 bg-surface/40 border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple' />
                                    <button type="button" onClick={handleSearchMedia} className='bg-purple text-light font-semibold px-4 rounded-lg hover:opacity-90 transition'>Ara</button>
                                </div>
                                {mediaResults.length > 0 && (
                                    <div className='flex gap-2 overflow-x-auto mt-3 pb-2'>
                                        {mediaResults.map((result) => (
                                            result.posterUrl && (
                                                <img key={result.id} src={result.posterUrl} alt={result.title} onClick={() => setImageUrl(result.posterUrl ?? '')} className={`w-20 h-28 object-cover rounded-lg cursor-pointer border-2 transition ${imageUrl === result.posterUrl ? 'border-yellow' : 'border-transparent'}`}/>
                                            )
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                        {(isKonserCategory || isEsporCategory) && (
                            <button type="button" onClick={() => setImageUrl(isKonserCategory ? KONSER_DEFAULT_IMAGE : ESPOR_DEFAULT_IMAGE)} className="text-purple text-sm underline hover:text-yellow transition block mt-2">
                                Varsayılan {isKonserCategory ? 'konser' : 'e-spor'} görselini kullan
                            </button>
                        )}
                        <label className='text-light/60 text-sm block mt-3 mb-1'>{(isMediaCategory || isSportsCategory) ? "Veya görsel URL'i yapıştır" : "Görsel URL'i yapıştır"}</label>
                        <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className='w-full bg-surface/40 border border-light/20 text-light rounded-lg px-4 py-2 focus:outline-none focus:border-purple'/>
                        {imageUrl && (
                            <img src={imageUrl} alt="Seçilen görsel" className='w-24 h-32 object-cover rounded-lg mt-2' />
                        )}
                    </div>

                    <button type='submit' disabled={isSubmitting} className='bg-yellow text-dark font-semibold rounded-lg py-2 mt-2 hover:opacity-90 transition'>{isSubmitting? 'Oluşturuluyor...' : 'Etkinliği oluştur'}</button>
                </form>
            </div>
        </div>
    );
}