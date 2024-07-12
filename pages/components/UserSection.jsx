"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { baseUrl } from '@/config';

const UserSection = () => {
  const [userList, setUserList] = useState([]);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const carouselRef = useRef(null);

  const getUserList = useCallback(async (currentToken) => {
    setIsLoading(true);
    try {
      let response;
      if (currentToken) {
        response = await axios.get(`${baseUrl}/v1/user/list`, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
      } else {
        response = await axios.get(`${baseUrl}/v1/user/login`);
      }
      setUserList(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    getUserList(storedToken);
  }, [getUserList]);

  const sendRequest = async (e, id) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${baseUrl}/v1/user/connection/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(response.data.message);
      getUserList();
    } catch (error) {
      console.error(error);
    }
  };


  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300; // Adjust this value as needed
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const renderUserList = (isLoggedIn) => (
    <div className="absolute -bottom-28 w-full">
      <div className="relative">
      {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
        <>
        <button 
          onClick={() => scrollCarousel('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div
          ref={carouselRef}
          className="w-full carousel carousel-center bg-gray-200 rounded-box space-x-4 p-3 overflow-x-auto"
        >
          {userList.map((user) => (
            <div
              className="carousel-item rounded-lg p-3 border bg-white border-gray-300 shadow-lg w-1/4 flex-shrink-0"
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
                    disabled={user.status === "i" ? true : false}
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
        <button 
          onClick={() => scrollCarousel('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
        </>
        )}
      </div>
    </div>
  );

  return <>{renderUserList(token !== null)}</>;
};

export default UserSection;