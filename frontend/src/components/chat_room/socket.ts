import { io, Socket } from 'socket.io-client';

let socket: Socket;

export function getSocket(): Socket {
    if (!socket) {
        let socketUrl: string;

        // ✅ Sur prod, déduire l'URL à partir du domaine actuel
        if (import.meta.env.VITE_SOCKET_URL) {
            socketUrl = import.meta.env.VITE_SOCKET_URL;
        } else if (import.meta.env.PROD) {
            // En prod: utiliser le même domaine que le site
            socketUrl = window.location.origin;
        } else {
            // En local: utiliser localhost:1337
            socketUrl = 'http://localhost:1337';
        }

        console.log('🔌 Socket URL:', socketUrl);
        
        socket = io(socketUrl, {
            transports: ['websocket'],
            autoConnect: true,
        });
    }
    return socket;
}