import api from './api';

export interface Report {
    id : string;
    reporterId: string;
    reportedUserId: string | null;
    reportedEventId: string | null;
    reason: string;
    createdAt: string;
    resolved: 'PENDING' | 'REVIEWED' | 'DISMISSED';
}

export interface Stats {
    activeUsers: number;
    totalEvents: number;
    categoryDistribution: { categoryId: string; _count:number}[];
    attendanceRate: number;
}

export async function getReports(){
    const response = await api.get<Report[]>('/admin/reports');
    return response.data;
}

export async function resolveReport(id:string, resolution:'REVIEWED' | 'DISMISSED'){
    const response = await api.patch<Report>(`/admin/reports/${id}/resolve`, { resolution });
    return response.data;
}

export async function suspendUser(userId: string) {
    const response = await api.patch(`/admin/users/${userId}/suspend`);
    return response.data;
}

export async function banUser(userId: string) {
    const response = await api.patch(`/admin/users/${userId}/ban`);
    return response.data;
}

export async function getStats() {
    const response = await api.get<Stats>('/admin/stats');
    return response.data;
}