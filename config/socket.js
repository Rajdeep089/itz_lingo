import { io } from 'socket.io-client';
import { baseUrl } from './index'; // Use your server URL

let socket;

export const initiateSocket = (token) => {
  socket = io(baseUrl, {
    query: { token }
  });

  socket.on('connect', () => {
    console.log('Connected to the socket server');
  });
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const subscribeToMessages = (callback) => {
  if (!socket) return;

  socket.on('newMessage', (message) => {
    callback(message);
  });
};

export const sendMessage = (message) => {
  if (socket) socket.emit('sendMessage', message);
};
