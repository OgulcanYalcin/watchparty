export interface Notification {
    id: string;
    userId: string;
    text: string;
    isRead: boolean;
    createdAt: string;
    eventId: string | null;
    event: { id: string; title: string } | null;
}