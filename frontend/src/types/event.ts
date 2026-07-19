export interface Category {
    id: string;
    name: string;
}

export interface EventHost {
    id: string;
    name: string;
    profilePicture: string | null;
    reputationScore: number;
}

export interface Event {
    id: string;
    title: string;
    description: string | null;
    date: string;
    capacity: string;
    address: string;
    latitude: number;
    longtitude: number;
    placeId: string;
    joiningMode: 'AUTOMATIC' | 'MANUAL';
    status: 'PLANNED' | 'CANCELLED' | 'COMPLETED';
    createdById: string;
    createdAt: string;
    updatedAt: string;
    categoryId: string;
    isPaid: boolean;
    category: Category;
    createdBy: EventHost;
}
