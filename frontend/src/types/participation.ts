export interface Participation {
    id: string;
    userId: string;
    eventId: string;
    requestedAt: string;
    requestStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    attended: boolean | null;
}