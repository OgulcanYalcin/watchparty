import api from './api';
import { type Event, type Category, type MediaSearchResult } from '../types/event';

export async function getEvents(filters?: {categoryId?: string; date?: string }) {
    const response = await api.get<Event[]>('/events', {
        params: filters 
    });
    return response.data;
}

export async function getEvent(id: string) {
    const response = await api.get<Event>(`/events/${id}`);
    return response.data;
}

export async function participateInEvent(eventId: string){
    const response = await api.post(`/events/${eventId}/participate`);
    return response.data;
}

export async function createEvent(data: {
    title: string;
    description?: string;
    date: string;
    capacity: number;
    address: string;
    latitude: number;
    longitude: number;
    placeId: string;
    categoryId: string;
    joiningMode: 'AUTOMATIC' | 'MANUAL';
    isPaid: boolean;
    imageUrl?: string;
}){
    const response = await api.post<Event>('/events', data);
    return response.data;
}
export async function getCategories(){
    const response = await api.get<Category[]>('/events/categories');
    return response.data;
}

export async function updateEvent(id: string, data: Partial<{
    title: string;
    description: string;
    date:string;
    capacity: number;
    address: string;
    latitude: number;
    longitude: number;
    placeId: string;
    categoryId: string;
    joiningMode: 'AUTOMATIC' | 'MANUAL';
    isPaid: boolean;
    imageUrl: string;
}>) {
    const response = await api.patch<Event>(`/events/${id}`, data);
    return response.data;
}

export async function cancelEvent(id:string){
    const response = await api.patch<Event>(`/events/${id}/cancel`);
    return response.data
}

export async function searchMedia(query: string) {
    const response = await api.get<MediaSearchResult[]>('/events/search-media', {
        params: { query },
    });
    return response.data;
}

export async function searchSports(query: string) {
    const response = await api.get<MediaSearchResult[]>('/events/search-sports', {
        params: {query},
    });
    return response.data;
}