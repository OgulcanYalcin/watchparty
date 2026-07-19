import api from './api';
import type { Participation } from '../types/participation';

interface ParticipantWithUser extends Participation {
    user: {
        id: string;
        name: string;
        profilePicture: string | null;
        reputationScore: number;
    };
}

export interface MyParticipation extends Participation {
    event: {
        id:string;
        title: string;
        date: string;
        address: string;
        status: 'PLANNED' | 'CANCELLED' | 'COMPLETED';
    };
}

export async function getMyParticipations() {
    const response = await api.get<MyParticipation[]>('/participations/me');
    return response.data;
}

export async function getParticipants(eventId: string) {
    const response = await api.get<ParticipantWithUser[]>(`/events/${eventId}/participants`);
    return response.data;
}

export async function approveParticipation(id: string) {
    const response = await api.patch<Participation>(`/participations/${id}/approve`);
    return response.data;
}

export async function rejectParticipation(id: string) {
    const response = await api.patch<Participation>(`/participations/${id}/reject`);
    return response.data;
}