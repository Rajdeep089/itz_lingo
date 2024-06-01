"use client";
const { Router } = require("next/router");
const axios = require("axios");
const { useEffect, useState } = require("react");

// const baseUrl = "http://3.109.210.144:8000";

const baseUrl = "https://swap-recordings-hall-tile.trycloudflare.com";



const useUserData = () => {
  const [userData, setUserData] = useState({
    age: 0,
    country: "N/A",
    educationLevel: "N/A",
    gender: "N/A",
    id: "id",
    name: "N/A",
    nativeLanguage: "N/A",
    profilePhoto: "N/A",
  });

  const [token, setToken] = useState(null);

  useEffect(() => {

    setToken(localStorage.getItem("token"));

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
            profilePhoto: info.profilePhoto || "N/A",
            proficiencyLevel: info.user.proficiencyLevel || "N/A",
            email: localStorage.getItem("email") || "N/A",
            token: localStorage.getItem("token") || "N/A",
          });

          // Save user data to localStorage
          localStorage.setItem("age", info.user.age || 0);
          localStorage.setItem("country", info.user.country || "N/A");
          localStorage.setItem("educationLevel", info.user.educationLevel || "N/A");
          localStorage.setItem("gender", info.user.gender || "N/A");
          localStorage.setItem("dob", info.user.dob || "");
          localStorage.setItem("nativeLanguage", info.user.nativeLanguage || "N/A");
          localStorage.setItem("profilePhoto", info.profilePhoto || "N/A");
          localStorage.setItem("name", info.user.name || "N/A");
          localStorage.setItem("proficiencyLevel", info.user.proficiencyLevel || "N/A");
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchData();
  }, [token]);

  return userData;
};



module.exports = { baseUrl, useUserData };
