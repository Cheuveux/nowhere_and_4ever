import { io, Socket } from 'socket.io-client';

let socket: Socket;

export function getSocket(): Socket {
    if (!socket) {
        // ✅ URL du serveur (s'adapte selon l'environnement)
        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:1337';
        
        socket = io(socketUrl, {
            transports: ['websocket'],
            autoConnect: true,
        });
    }
    return socket;
}