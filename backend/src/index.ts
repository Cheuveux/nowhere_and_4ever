// backend/src/index.ts
import { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      const io = require('socket.io')(strapi.server.httpServer, {
        cors: {
          origin: process.env.FRONTEND_URL || 'http://localhost:3000',
          methods: ['GET', 'POST'],
        },
      });

      io.on('connection', (socket: any) => {
        socket.on('join-room', (roomSlug: string) => {
          socket.join(roomSlug);
        });

        socket.on('send-message', async ({roomSlug, content, username, parentId}: any) => {
          console.log('📨 RECV send-message:', {roomSlug, content, username, parentId, type: typeof parentId});
          
          // ✅ Chercher la room par slug
          const room = await strapi.db.query('api::room.room').findOne({ 
            where: { slug: roomSlug } 
          });

          if (!room) {
            socket.emit('error', { message: 'Room not found' });
            return;
          }

          // ✅ Créer le message avec l'ID de la room
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
            
            // ✅ Ajouter le parent à l'objet émis si c'est une réponse
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