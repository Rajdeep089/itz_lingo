import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from "socket.io-client";
import { baseUrl } from "../config";
import { useAuth } from '@/config/AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
}

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [socketId, setSocketId] = useState(null);
  // const [token, setToken] = useState(null);

  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token && !socket) {
      const newSocket = io(baseUrl, {
        auth: {
          token: `Bearer ${token}`,
        },
      });

      newSocket.on('connect', () => {
        setSocketId(newSocket.id);
        console.log("Connected to the socket server for video call", newSocket.id);
      });

      newSocket.on('disconnect', () => {
        console.log("Disconnected from the socket server");
      });

      setSocket(newSocket);

      // return () => {
      //   if (newSocket) {
      //     newSocket.disconnect();
      //   }
      // };
    }
  }, [isAuthenticated, token, socket]);

  return (
    <SocketContext.Provider value={{ socket, socketId }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
