export interface Pet {
    id?: number;
    name: string;
    category: {
        id: number;
        name: string;
    };
    photoUrls: string[];
    tags: Array<{
        id: number;
        name: string;
    }>;
    status: 'available' | 'pending' | 'sold';
}

export interface Order {
    id?: number;
    petId: number;
    quantity: number;
    shipDate?: string;
    status: 'placed' | 'approved' | 'delivered';
    complete: boolean;
}

export interface User {
    id?: number;
    username?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    userStatus: number;
}

export interface PetTestData {
    pet: Pet;
    updatedStatus: 'available' | 'pending' | 'sold';
}

export interface StoreTestData {
    order: Order;
}

export interface UserTestData {
    user: User;
    updatedEmail: string;
    multipleUsers: User[];
}