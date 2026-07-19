export interface User{
    id: string;
    email: string;
    name: string;
    phoneNumber: string | null;
    phoneVerified: boolean;
    profilePicture: string | null;
    biography: string | null;
    reputationScore: number;
    status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
    role: 'USER' | 'ADMIN' ;
    createdAt: string;
    updatedAt: string;
}

export interface PublicProfile {
    id: string;
    name: string;
    profilePicture: string | null;
    biography: string | null;
    reputationScore: number;
    createdAt: string;
}

export interface MyProfile {
    id: string;
    name: string;
    email: string;
    profilePicture: string | null;
    biography: string | null;
    reputationScore: number;
    role: 'USER' | 'ADMIN';
    status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
    createdAt: string;
}