// components/NotificationIcon.js
import React from 'react';
import { useRouter } from 'next/router';
import { useNotification } from '../context/NotificationContext';

const NotificationIcon = () => {
  const router = useRouter();
  const { hasNewMessage, setHasNewMessage } = useNotification();

  if (!hasNewMessage) return null;

  const handleClick = () => {
    setHasNewMessage(false);
    router.push('/chats');
  };

  return (
    <div
      className="fixed top-4 right-16 bg-red-500 text-white rounded-full p-2 cursor-pointer z-50"
      onClick={handleClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    </div>
  );
};

export default NotificationIcon;