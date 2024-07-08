"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '@/config';

const UserSection = () => {
  const [userList, setUserList] = useState([]);
  const [token, setToken] = useState(null);
  const [send, setSend] = useState(false);

  const getUserList = async () => {
    try {
      let response;
      if (token) {
        response = await axios.get(`${baseUrl}/v1/user/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await axios.get(`${baseUrl}/v1/user/login`);
      }
      setUserList(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  console.log(userList);

  const sendRequest = async (e, id) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${baseUrl}/v1/user/connection/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(response.data.message);
      // setSend(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    getUserList();
  }, [token]);

  const renderUserList = (isLoggedIn) => (
    <div className="absolute -bottom-28 w-full">
      <div className="w-full carousel carousel-center bg-gray-200 rounded-box space-x-4 p-3">
        {userList.map((user) => (
          <div
            className="carousel-item rounded-lg p-3 border bg-white border-gray-300 shadow-lg w-1/4"
            key={user.id}
          >
            <div className="w-full flex flex-row justify-start items-center gap-4 relative">
              <img
                src={user.profilePhoto || "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?w=740&t=st=1717239089~exp=1717239689~hmac=a9d545fd4d72cf1418c9d0085aa91c7f6c60bd4d8e2fe84d5dd5a94e2350dc4d"}
                className="size-20 border"
                alt={user.name}
              />
              <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p>{user.educationLevel || "Education Level"}</p>
              </div>
              {isLoggedIn && (
                <button
                  disabled={user.status === "i"  ? true : false}
                  onClick={(e) => {
                    if (user.status === "i") return;
                    if (user.status === "c") return;
                    if (user.status === "a") return;
                    sendRequest(e, user.id)
                  }}
                  className={`btn btn-xs rounded-3xl absolute right-0 top-0 ${
                    user.status === "i"
                      ? "btn-disabled"
                      : user.status === "c"
                      ? "btn-info"
                      : user.status === "a"
                      ? "btn-outline"
                      : "btn-success"
                  }`}
                >
                  {user.status === "i"
                    ? "Invited"
                    : user.status === "c"
                    ? "Friend"
                    : user.status === "a"
                    ? "Requested"
                    : "+ Invite"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return <>{renderUserList(token !== null)}</>;
};

export default UserSection;