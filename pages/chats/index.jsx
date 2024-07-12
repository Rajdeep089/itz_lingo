import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useRouter } from 'next/router';
import { useSocket } from "../../context/SocketProvider";
import { baseUrl } from "@/config";
import axios from "axios";
import UserCard from "./components/UserCard";
import {useSocketHandlers} from "../../config/socket";
import Image from "next/image";
import Msg from "../../Assets/msg.jpg";
import { debounce } from 'lodash';

const Chats = () => {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(null);
  const [unreadMsgs, setUnreadMsgs] = useState(null);
  const [userId, setUserId] = useState(null);
  const [convoId, setConvoId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [chat, setChat] = useState(null);
  const [rid, setRid] = useState(null);
  const [userList, setUserList] = useState([]);
  const [requests, setRequests] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const chatEndRef = useRef(null);

  const { socket } = useSocket();
  const {
    subscribeToMessages,
    sendMessage,
    handleCallUser,
  } = useSocketHandlers();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    const storedEmail = localStorage.getItem("email");
    const storedName = localStorage.getItem("name");
    setPhoto(localStorage.getItem("profilePhoto"));
    setToken(storedToken);
    setUserId(storedUserId);
    setEmail(storedEmail);
    setName(storedName);
  }, []);

  const fetchUsers = async () => {
    if (token) {
      try {
        const response = await axios.get(`${baseUrl}/v1/user/friends`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.data.friends);
        setUnreadMsgs(response.data.data.unreadCount);
  
        // Create an object with user IDs as keys and their unread message counts as values
        const unreadCountsObj = response.data.data.friends.reduce((acc, friend) => {
          acc[friend.user.id] = friend.unreadMessageCount;
          return acc;
        }, {});
        setUnreadCounts(unreadCountsObj);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getUserList = async () => {
    try {
      const response = await axios.get(`${baseUrl}/v1/user/list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserList(response.data.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  useEffect(() => {
    getUserList();
    fetchUsers();
    pendingRequest();
  }, [token, userId, unreadMsgs]);
  
  const pendingRequest = async () => {
    try {
      const response = await axios.get(`${baseUrl}/v1/user/connection-requests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response.data.data)
      setRequests(response.data.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  const acceptRequest = async (e, id) => {
    e.preventDefault();
    console.log(id)
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const response = await axios.put(`${baseUrl}/v1/user/connection/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      document.getElementById("request-modal")?.close();
      pendingRequest();
      fetchUsers();
      getUserList();
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  const sendRequest = async (e,id) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${baseUrl}/v1/user/connection/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (convoId) {
        try {
          const response = await axios.get(
            `${baseUrl}/v1/user/chat/${convoId.userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setMessages(response.data);
          console.log(messages);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchMessages();

    const handleNewMessage = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      if (newMessage.senderId !== userId && newMessage.senderId !== convoId?.userId) {
        setUnreadCounts((prevCounts) => ({
          ...prevCounts,
          [newMessage.senderId]: (prevCounts[newMessage.senderId] || 0) + 1
        }));
      }
    };

    if (convoId) {
      subscribeToMessages(handleNewMessage);
    }

    return () => {
      if (convoId) {
        socket.off("message", handleNewMessage);
      }
    };
  }, [convoId, token, userId]);

  const handleConvoSelect = (selectedUser) => {
    setConvoId(selectedUser);
    setUnreadCounts((prevCounts) => ({
      ...prevCounts,
      [selectedUser.userId]: 0
    }));
    
    // Update the users state to reflect the change in unread count
    setUsers((prevUsers) => 
      prevUsers.map((user) => 
        user.user.id === selectedUser.userId 
          ? { ...user, unreadMessageCount: 0 }
          : user
      )
    );
  };

  useEffect(() => {
    if (convoId) {
      setUnreadCounts(prevCounts => ({
        ...prevCounts,
        [convoId.userId]: 0
      }));
    }
  }, [convoId]);

  const debouncedScroll = useCallback(
    debounce(() => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100),
    []
  );
  
  useEffect(() => {
    debouncedScroll();
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
    console.log(messages);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  useEffect(() => {
    if (chat) {
      handleSendMessage(chat);
    }
  }, [chat]);


useEffect(() => {
  if (convoId && rid !== null) {
    try {
      handleCall(rid);
    } catch (error) {
      console.error("Error occurred while making a call: ", error);
    }
  }
}, [rid]);

  const handleCall = (receiverId) => {
    if (receiverId === null || receiverId === undefined) {
      console.error("Receiver ID is null or undefined.");
      return;
    }

    try {
      handleCallUser(receiverId);
    } catch (error) {
      console.error("Error occurred while making a call: ", error);
    }
  };

  return (
    <div className="transition-all duration-300 ease-in-out">
      
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
                      <img
                        src={convoId.photo}
                        alt="profile"
                        className="w-auto h-auto"
                      />
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
                  <button
                    className="btn btn-circle btn-sm font-bold"
                    onClick={() => {
                      setRid(convoId.userId);
                    }}
                  >
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
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.970c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                      />
                    </svg>
                  </button>
                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-circle btn-sm font-bold"
                    >
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
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow md:bg-gradient-to-b md:from-[#000000]/90 bg-[#000000]/50 text-white rounded-box md:w-80 w-60 divide-y"
                    >
                      <li>
                        <div className="flex">
                          <img
                            className="w-10 rounded-full"
                            alt="Avatar"
                            loading="lazy"
                            src={convoId.photo}
                          />
                          <div className="ml-4">
                            <div className="font-bold">{convoId.name}</div>
                            <div className="text-sm opacity-50">
                              {convoId.email}
                            </div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <button> Block User</button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-between w-full">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold grid">Messages</h1>
                </div>
              </div>
            )}
          </div>
          {/* Chat Body */}
          <div className="flex flex-col w-full overflow-y-auto absolute top-0 bottom-0 my-auto h-[80%]">
            {convoId ? (
              <>
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
                          src={
                            message.senderId === userId ? photo : convoId.photo
                          }
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
                  </div>
                ))}
                <div ref={chatEndRef} />
              </>
            ) : (
              <div className="flex flex-col justify-center items-center h-full">
                <Image
                  src={Msg}
                  width={400}
                  height={400}
                  alt="empty"
                  priority
                  className="opacity-50 w-auto h-auto"
                />
                <h1 className="text-xl font-bold text-gray-400 grid">
                  Select a conversation
                </h1>
              </div>
            )}
          </div>
          {convoId && (
            <div className=" absolute w-full left-0 right-0 bottom-0 p-4 mx-auto">
              <input
                type="text"
                placeholder="Type a message"
                className="input input-bordered w-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setChat(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Side Drawer */}
        <div className=" drawer-open">
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

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    document.getElementById("list-modal").showModal()
                  }
                  className="btn btn-circle btn-xs btn-outline font-bold"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
</svg>

                </button>
                <button
                  onClick={() =>
                    document.getElementById("request-modal").showModal()
                  }
                  className="btn btn-circle btn-xs btn-outline font-bold"
                >
                  i
                </button>
              </div>
            </div>

            <dialog id="list-modal" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-2xl mb-5">User List</h3>
                {userList &&
                  userList.length > 0 &&
                  userList.map((user) => (
                    <div className="w-full flex flex-row justify-start items-center gap-4 relative my-2 border p-2 rounded-lg">
                      <img
                        src={
                          user.profilePhoto
                            ? user.profilePhoto
                            : "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?w=740&t=st=1717239089~exp=1717239689~hmac=a9d545fd4d72cf1418c9d0085aa91c7f6c60bd4d8e2fe84d5dd5a94e2350dc4d"
                        }
                        className="size-16 rounded-full border"
                        alt={user.name}
                      />
                      <div className="flex flex-col gap-2">
                        <h1 className="text-lg font-semibold">{user.name}</h1>
                        <p className="">
                          {user.educationLevel
                            ? user.educationLevel
                            : "Education Level"}
                        </p>
                      </div>
                      {localStorage.getItem("token") && (
                        <button 
                        onClick={(e) => sendRequest(e, user.id)}
                        className="btn btn-xs btn-success rounded-3xl absolute right-2 top-2">
                          + Invite
                        </button>
                      )}
                    </div>
                  ))}
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>

            <dialog id="request-modal" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-2xl mb-5">Request List</h3>

                <div>
                  {requests &&
                    requests.length > 0 &&
                    requests.map((request, index) => (
                        <div
                          key={index}
                          className="w-full flex flex-row justify-between items-center gap-4 relative my-2 border p-2 rounded-lg"
                        >
                          <p className="text-lg font-semibold">{request.user.name.toUpperCase()}</p>
                          <div>
                            <button 
                            onClick={(e) => 
                              acceptRequest(e, request.senderId)
                            }
                            className="btn btn-xs btn-success rounded-3xl mr-2">
                              Accept
                            </button>
                            <button className="btn btn-xs btn-error rounded-3xl">
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>

            <input
              type="text"
              placeholder="Search Messages"
              className="input input-bordered w-full my-2 "
            />

            <div className="flex flex-col gap-2 bg-base-300 py-3 px-1 rounded-xl">
            {users && users.length > 0 ? (
  users.map((user, index) => (
    <UserCard 
      key={index} 
      users={user} 
      setConvoId={handleConvoSelect}
      unreadCount={user.unreadMessageCount}
    />
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
