import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from "socket.io-client";
import { baseUrl } from "../config";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
}

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
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

      // Clean up function to disconnect the socket when the component unmounts
      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    }
  }, []); // Empty dependency array to run only once on mount

  return (
    <SocketContext.Provider value={{ socket, socketId }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
