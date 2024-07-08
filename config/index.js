"use client";
const { Router } = require("next/router");
const axios = require("axios");
const { useEffect, useState } = require("react");

const baseUrl = "http://3.110.40.10:8000";

// const baseUrl = "http://itzlingo.com";



const useUserData = () => {
  const [userData, setUserData] = useState({
    age: 0,
    country: "",
    educationLevel: "",
    gender: "",
    id: "id",
    name: "",
    nativeLanguage: "",
    profilePhoto: "",

  });

  const [token, setToken] = useState(null);

  useEffect(() => {

    setToken(localStorage.getItem("token"));

  }, []);

  useEffect(() => {

    // setToken(localStorage.getItem("token"));

    const fetchData = async () => {
      if (token) {
        try {
          const response = await axios.get(`${baseUrl}/v1/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const info = response.data.data;
          // console.log("Response:", info);

          // Set user data
          setUserData({
            age: info.user.age || 0,
            country: info.user.country || "N/A",
            educationLevel: info.user.educationLevel || "N/A",
            gender: info.user.gender || "N/A",
            dob: info.user.dob || "",
            id: "id",
            name: info.user.name || "N/A",
            nativeLanguage: info.user.nativeLanguage || "N/A",
            profilePhoto: info.profilePhoto || "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?w=740&t=st=1717239089~exp=1717239689~hmac=a9d545fd4d72cf1418c9d0085aa91c7f6c60bd4d8e2fe84d5dd5a94e2350dc4d",
            proficiencyLevel: info.user.proficiencyLevel || "N/A",
            email: localStorage.getItem("email") || "N/A",
            contact: info.user.phoneNumber || "N/A",
            // token: localStorage.getItem("token") || "N/A",
          });

          // Save user data to localStorage
          // localStorage.setItem("age", info.user.age || 0);
          // localStorage.setItem("country", info.user.country || "N/A");
          // localStorage.setItem("educationLevel", info.user.educationLevel || "N/A");
          // localStorage.setItem("gender", info.user.gender || "N/A");
          // localStorage.setItem("dob", info.user.dob || "");
          // localStorage.setItem("nativeLanguage", info.user.nativeLanguage || "N/A");
          // localStorage.setItem("profilePhoto", info.profilePhoto || "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?w=740&t=st=1717239089~exp=1717239689~hmac=a9d545fd4d72cf1418c9d0085aa91c7f6c60bd4d8e2fe84d5dd5a94e2350dc4d");
          // localStorage.setItem("name", info.user.name || "N/A");
          // localStorage.setItem("proficiencyLevel", info.user.proficiencyLevel || "N/A");
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchData();
  }, [token]);

  return userData;
};

const fetchUserData = async (token) => {
  if (!token) {
    return;
  }

  try {
    const response = await axios.get(`${baseUrl}/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const info = response.data.data;

    const userData = {
      age: info.user.age || 0,
      country: info.user.country || "N/A",
      educationLevel: info.user.educationLevel || "N/A",
      gender: info.user.gender || "N/A",
      dob: info.user.dob || "",
      id: info.user.id,
      name: info.user.name || "N/A",
      nativeLanguage: info.user.nativeLanguage || "N/A",
      profilePhoto: info.profilePhoto || "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?w=740&t=st=1717239089~exp=1717239689~hmac=a9d545fd4d72cf1418c9d0085aa91c7f6c60bd4d8e2fe84d5dd5a94e2350dc4d",
      proficiencyLevel: info.user.proficiencyLevel || "N/A",
      email: localStorage.getItem("email") || "N/A",
      contact: info.user.phoneNumber || "N/A",
    };

    // Save user data to localStorage
    localStorage.setItem("age", userData.age);
    localStorage.setItem("country", userData.country);
    localStorage.setItem("educationLevel", userData.educationLevel);
    localStorage.setItem("gender", userData.gender);
    localStorage.setItem("dob", userData.dob);
    localStorage.setItem("nativeLanguage", userData.nativeLanguage);
    localStorage.setItem("profilePhoto", userData.profilePhoto);
    localStorage.setItem("name", userData.name);
    localStorage.setItem("proficiencyLevel", userData.proficiencyLevel);
    localStorage.setItem("contact", userData.contact);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};



module.exports = { baseUrl, useUserData, fetchUserData };
