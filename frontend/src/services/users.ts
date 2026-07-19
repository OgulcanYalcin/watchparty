import api from './api';
import type { MyProfile, PublicProfile } from '../types/user';

export async function getMyProfile() {
    const response = await api.get<MyProfile>('/users/me');
    return response.data;
}

export async function getUserProfile(id:string) {
    const response = await api.get<PublicProfile>(`/users/${id}`);
    return response.data;
}

export async function updateProfile(data: { name?: string; biography?: string; profilePicture?: string }) {
    const response = await api.patch('/users/me', data);
    return response.data;
}