import { io, Socket } from 'socket.io-client';

let socket: Socket;

export function getSocket(): Socket {
    if (!socket) {
        let socketUrl: string;

        // ✅ Priority 1: Env variable (pour override manuel)
        if (import.meta.env.VITE_SOCKET_URL) {
            socketUrl = import.meta.env.VITE_SOCKET_URL;
        } 
        // ✅ Priority 2: Check si vraiment sur localhost
        else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            socketUrl = 'http://localhost:1337';
        }
        // ✅ Priority 3: En prod, utiliser le domaine actuel
        else {
            socketUrl = window.location.origin;
        }

        console.log('🔌 Socket URL:', socketUrl, '| Hostname:', window.location.hostname);
        
        socket = io(socketUrl, {
            transports: ['websocket'],
            autoConnect: true,
        });
    }
    return socket;
}