import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import { baseUrl } from "@/config";
import axios from "axios";
import UserCard from "./components/UserCard";
import { initiateSocket, disconnectSocket, subscribeToMessages, sendMessage } from "../../config/socket";

const Chats = () => {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(null);
  const [unreadMsgs, setUnreadMsgs] = useState(null);
  const [userId, setUserId] = useState(null);
  const [convoId, setConvoId] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    setToken(storedToken);
    setUserId(storedUserId);

    if (storedToken) {
      initiateSocket(storedToken);
    }

    return () => {
      disconnectSocket();
    };
  }, []);

  console.log(convoId)

  useEffect(() => {
    if (token) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(`${baseUrl}/v1/user/friends`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsers(response.data.data.friends);
          setUnreadMsgs(response.data.data.unreadCount);
        } catch (error) {
          console.error(error);
        }
      };
      fetchUsers();
    }
  }, [token]);

  useEffect(() => {
    if (convoId) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`${baseUrl}/v1/user/chat/${convoId.userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setMessages(response.data.messages || []); // Ensure messages is always an array
        } catch (error) {
          console.error(error);
        }
      };
      fetchMessages();
  
      subscribeToMessages((newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }
  }, [convoId, token]);
  

  const handleSendMessage = (text) => {
    const message = {
      conversationId: convoId.convoId,
      senderId: userId,
      text,
    };
    sendMessage(message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  console.log(users);
  console.log(unreadMsgs);
  console.log(messages)

  return (
    <div>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <div>
          <label htmlFor="my-drawer" className="btn btn-circle drawer-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>
          </label>
            <div>

            </div>
          </div>
          {/* Chat Body */}
          {messages.map((message, index) => (
            <div key={index} className={`chat ${message.senderId === userId ? "chat-end" : "chat-start"}`}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User avatar"
                    src={message.senderId === userId ? users.profilePhoto : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}
                  />
                </div>
              </div>
              <div className="chat-header">
                {message.senderId === userId ? "You" : message.senderName}
                <time className="text-xs opacity-50">{new Date(message.timestamp).toLocaleTimeString()}</time>
              </div>
              <div className="chat-bubble">{message.text}</div>
              <div className="chat-footer opacity-50">Delivered</div>
            </div>
          ))}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Type a message"
              className="input input-bordered w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage(e.target.value);
                  e.target.value = '';
                }
              }}
            />
          </div>
        </div>

        {/* Side Drawer */}
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content gap-4">
            {/* Sidebar content here */}
            <div className="flex justify-between w-full">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold grid">Messages</h1>
                <span className="badge badge-primary">{unreadMsgs}</span>
              </div>

              <div className="flex items-center gap-2">
                <button className="btn btn-circle btn-xs btn-outline font-bold">
                  i
                </button>
                <button className="btn btn-circle btn-xs btn-outline font-bold">
                  i
                </button>
              </div>
            </div>

            <input
              type="text"
              placeholder="Search Messages"
              className="input input-bordered w-full my-2 "
            />

            <div className="flex flex-col gap-2 bg-base-300 py-3 px-1 rounded-xl">
              {users && users.length > 0 ? (
                users.map((user, index) => <UserCard key={index} user={user} setConvoId={setConvoId} />)
              ) : (
                <p>No friends found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
