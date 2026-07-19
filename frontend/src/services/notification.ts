import api from './api'
import type { Notification } from '../types/notification'

export async function getNotifications() {
    const response = await api.get<Notification[]>('/notifications');
    return response.data;
}

export async function markAsRead(id: string) {
    const mark = await api.patch<Notification>(`/notifications/${id}/read`);
    return mark.data;
}