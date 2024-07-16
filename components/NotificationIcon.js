// components/NotificationToast.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useNotification } from '../context/NotificationContext';

const NotificationToast = () => {
  const router = useRouter();
  const { hasNewMessage, setHasNewMessage, lastMessageSenderId } = useNotification();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let timer;
    if (hasNewMessage) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
      timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setShouldRender(false);
          setHasNewMessage(false);
        }, 300);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [hasNewMessage, setHasNewMessage]);

  if (router.pathname === '/chats' || !shouldRender) return null;

  const handleClick = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShouldRender(false);
      setHasNewMessage(false);
      router.push(`/chats`);
      console.log(lastMessageSenderId);
    }, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer z-50 transition-all duration-300 ease-in-out transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <div>
          <h3 className="font-semibold text-gray-900">New Message</h3>
          <p className="text-sm text-gray-600">You have a new message in your chat.</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;