// backend/src/index.ts
import { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      const io = require('socket.io')(strapi.server.httpServer, {
        cors: {
          origin: (process.env.FRONTEND_URL || 'http://localhost:3000').split(','),
          methods: ['GET', 'POST'],
          credentials: true,
        },
      });

      io.on('connection', (socket: any) => {
        console.log('✅ Socket connected:', socket.id);
        
        // ✅ JOIN ROOM - avec compteur utilisateurs
        socket.on('join-room', (roomSlug: string) => {
          socket.join(roomSlug);
          console.log(`📍 User joined room: ${roomSlug}`);
        
          const roomClients = io.sockets.adapter.rooms.get(roomSlug);
          const userCount = roomClients ? roomClients.size : 0;
          console.log(`👥 Room ${roomSlug} has now ${userCount} users`);
          io.to(roomSlug).emit('room-users-count', userCount);
        });

        // ✅ LEAVE ROOM
        socket.on('leave-room', (roomSlug: string) => {
          socket.leave(roomSlug);
          console.log(`📍 User left room: ${roomSlug}`);

          const roomClients = io.sockets.adapter.rooms.get(roomSlug);
          const userCount = roomClients ? roomClients.size : 0;
          console.log(`👥 Room ${roomSlug} has now ${userCount} users`);
          io.to(roomSlug).emit('room-users-count', userCount); 
        });

        // ✅ DISCONNECT
        socket.on('disconnect', () => {
          console.log('❌ Socket disconnected:', socket.id);

          socket.rooms.forEach((room) => {
            if (room !== socket.id) {
              const roomClients = io.sockets.adapter.rooms.get(room);
              const userCount = roomClients ? roomClients.size : 0;
              console.log(`👥 Room ${room} has now ${userCount} users`);
              io.to(room).emit('room-users-count', userCount);
            }
          });
        });

        // ✅ SEND MESSAGE
        socket.on('send-message', async ({roomSlug, content, username, parentId}: any) => {
          console.log('📨 RECV send-message:', {roomSlug, content, username, parentId, type: typeof parentId});
          
          const room = await strapi.db.query('api::room.room').findOne({ 
            where: { slug: roomSlug } 
          });

          if (!room) {
            socket.emit('error', { message: 'Room not found' });
            return;
          }

          try {
            const data: any = {
              content: [
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: content }],
                },
              ],
              pseudo: username,
              room: room.id,
              publishedAt: new Date(),
            };

            if (parentId) {
              console.log('↩️ Création réponse à message:', parentId);
              data.parent = parentId;
            }

            const message = await strapi.entityService.create('api::message.message', {
              data,
            });
            
            console.log('✅ Message créé, ID:', message.id, 'avec parent:', parentId || 'aucun');
            
            const messageToEmit = parentId 
              ? { ...message, parent: { id: parentId } }
              : message;
            
            io.to(roomSlug).emit('new-message', messageToEmit);
          } catch (err) {
            console.error('❌ Message création error:', err);
          }
        });
      });
    } catch (err) {
      console.error('Socket.io initialization error:', err);
    }
  },
};