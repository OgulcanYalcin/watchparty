import api from './api';

export async function register(data: { email: string; name: string; password: string }) {
    const response = await api.post('/users/register', data);
    return response.data;
}

export async function login(data: { email: string; password: string }) {
    const response = await api.post('/users/login', data);
    return response.data;
}