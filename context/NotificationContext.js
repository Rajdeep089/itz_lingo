// context/NotificationContext.js
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [lastMessageSenderId, setLastMessageSenderId] = useState(null);

  return (
    <NotificationContext.Provider value={{ hasNewMessage, setHasNewMessage, lastMessageSenderId, setLastMessageSenderId }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);