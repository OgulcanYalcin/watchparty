import { Link } from 'react-router-dom';
import type { Event } from '../types/event';

export function EventCard({ event }: { event: Event}) {
    return (
        <Link to={`/events/${event.id}`} className='bg-black/40 border border-purple/20 rounded-xl p-5 hover:border-purple transition flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
                <span className='text-yellow text-xs font-semibold uppercase tracking-wide'>
                    {event.category.name}
                </span>
                {event.status === 'CANCELLED' && (
                    <span className='text-red-400 text-sx font-semibold'>İptal Edildi</span>
                )}
            </div>
            <h3 className='text-light text-lg font-bold'>{event.title}</h3>
            <p className='text-light/60 text-sm'>{event.address}</p>
            <p className='text-light/60 text-sm'>{new Date(event.date).toLocaleString('tr-TR')}</p>
            <p className='text-purple text-sm mt-1'>Host:{event.createdBy.name}</p>
        </Link>
    );
}