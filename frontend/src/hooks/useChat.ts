import { useEffect, useRef, useState } from "react";
import { io, Socket} from 'socket.io-client';

interface ChatMessage {
    id: string;
    userId: string;
    eventId: string;
    content: string;
    sentAt: string;
    user: {
        id: string;
        name: string;
        profilePicture: string | null;
    };
}

export function useChat(eventId: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState('');
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const socket = io(import.meta.env.VITE_API_URL, { auth: { token } });
        socketRef.current = socket;
        socket.on('connect', () => {
            setConnected(true);
            socket.emit('joinEvent', {eventId });
        });
        socket.on('newMessage', (message: ChatMessage) => {
            setMessages((prev) => [...prev, message]);
        });
        socket.on('error', (msg:string) => {
            setError(msg);
        });
        socket.on('disconnect', () => setConnected(false));

        return () => {
            socket.disconnect();
        };
    }, [eventId]);

    const sendMessage = (content: string) => {
        socketRef.current?.emit('sendMessage', {eventId, content});
    };

    return {messages, setMessages, connected, error, sendMessage };
}