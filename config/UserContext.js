// UserContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { baseUrl } from '@/config';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userList, setUserList] = useState([]);
  const [lastFetched, setLastFetched] = useState(null);
  const { token } = useAuth();

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${baseUrl}/v1/user/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserList(response.data.data);
      setLastFetched(Date.now());
      localStorage.setItem('userList', JSON.stringify(response.data.data));
      localStorage.setItem('lastFetched', Date.now().toString());
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const value = {
    userList,
    setUserList,
    lastFetched,
    fetchUsers,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);