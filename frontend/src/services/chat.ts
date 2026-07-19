import api from './api'

export interface ChatMessage {
    id: string;
    userId:string;
    eventId: string;
    content: string;
    sentAt: string;
    user: {
        id: string;
        name: string;
        profilePicture: string | null;
    };
}

export async function getMessages(eventId:string) {
    const response = await api.get<ChatMessage[]>(`/events/${eventId}/messages`);
    return response.data;
}