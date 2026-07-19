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
    email: string;
    role: 'USER' | 'ADMIN';
    status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
}