// contexts/NotificationContext.js
import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [hasNewMessage, setHasNewMessage] = useState(false);

  return (
    <NotificationContext.Provider value={{ hasNewMessage, setHasNewMessage }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
      throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
  };