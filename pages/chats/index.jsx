import React, { useState, useEffect, useRef } from "react";
import { baseUrl } from "@/config";
import axios from "axios";
import UserCard from "./components/UserCard";
import {
  initiateSocket,
  disconnectSocket,
  subscribeToMessages,
  sendMessage,
} from "../../config/socket";

const Chats = () => {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(null);
  const [unreadMsgs, setUnreadMsgs] = useState(null);
  const [userId, setUserId] = useState(null);
  const [convoId, setConvoId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [photo, setPhoto] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    setPhoto(localStorage.getItem("profilePhoto") === "N/A" ? "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?w=740&t=st=1717239089~exp=1717239689~hmac=a9d545fd4d72cf1418c9d0085aa91c7f6c60bd4d8e2fe84d5dd5a94e2350dc4d" : localStorage.getItem("profilePhoto"));
    setToken(storedToken);
    setUserId(storedUserId);

    if (storedToken) {
      initiateSocket(storedToken);
    }

    return () => {
      disconnectSocket();
    };
  }, []);

  console.log(convoId);

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
          const response = await axios.get(
            `${baseUrl}/v1/user/chat/${convoId.userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setMessages(response.data || []); // Ensure messages is always an array
          console.log(response.data);
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

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (text) => {
    const message = {
      rid: convoId.userId,
      sid: userId,
      content: text,
      senderId: userId,
      createdAt: new Date().toISOString(),
    };
    sendMessage(message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  console.log(users);
  console.log(unreadMsgs);
  console.log(messages);

  return (
    <div>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content relative h-screen">
          {/* Page content here */}
          <div className="w-full flex absolute top-0 gap-4 right-0 left-0 p-4 bg-white">
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
            {convoId ? (
              <div className="flex justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img src={convoId.photo} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-bold grid">{convoId.name}</h1>
                    <p className="text-sm opacity-50">
                      Online
                      <span className="badge badge-success badge-xs ml-2"></span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <button className="btn btn-circle btn-sm font-bold">
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
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                      />
                    </svg>
                  </button>
                  <button className="btn btn-circle btn-sm font-bold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between w-full">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold grid">Messages</h1>
                  {/* <span className="badge badge-primary">{unreadMsgs}</span> */}
                </div>

                {/* <div className="flex items-center gap-2">
                <button className="btn btn-circle btn-xs btn-outline font-bold">
                  i
                </button>
                <button className="btn btn-circle btn-xs btn-outline font-bold">
                  i
                </button>
              </div> */}
              </div>
            )}
          </div>
          {/* Chat Body */}
          <div className="flex flex-col w-full overflow-y-auto absolute top-0 bottom-0 my-auto h-[80%]">
            {messages.map((message, index) => (
            <div
              key={index}
              className={`chat ${
                message.senderId === userId ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User avatar"
                    src={message.senderId === userId ? photo : convoId.photo}
                  />
                </div>
              </div>
              <div className="chat-header">
                {message.senderId === userId ? "You" : convoId.name}
                <time className="text-xs opacity-50">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </time>
              </div>
              <div className="chat-bubble">{message.content}</div>
              {/* <div className="chat-footer opacity-50">Delivered</div> */}
            </div>
          ))}
          <div ref={chatEndRef} />
          </div>
          
          <div className=" absolute w-full left-0 right-0 bottom-0 p-4 mx-auto">
            <input
              type="text"
              placeholder="Type a message"
              className="input input-bordered w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(e.target.value);
                  e.target.value = "";
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
                users.map((user, index) => (
                  <UserCard key={index} users={user} setConvoId={setConvoId} />
                ))
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
