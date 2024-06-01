import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import EditProfileForm from "./components/EditProfileForm";
import Preferences from "./components/Preferences";
import PaymentInfo from "./components/PaymentInfo";
import {  useUserData, baseUrl } from "@/config";
import axios from "axios";

const EditProfile = () => {

  const allData = useUserData();

  const [toggle, setToggle] = useState(1);
  const [token, setToken] = useState(null);
  const [submitProfile, setSubmitProfile] = useState(false);
  const [submitPreferences, setSubmitPreferences] = useState(false);
  const [submitPaymentInfo, setSubmitPaymentInfo] = useState(false);
  const [imageUrl, setImageUrl] = useState("https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?w=740&t=st=1717072910~exp=1717073510~hmac=e873f13245e495f087b82863921ef900e94e8a44d1c75009ad9cfc315880f194");

  useEffect(() => {
    if (allData) {
      setImageUrl(allData.profilePhoto);
    }
  }, [allData]);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const handleToggle = (num) => {
    // Prevent moving to the next step until the current step is completed
    if ((num === 2 && !submitProfile) || (num === 3 && !submitPreferences)) {
      return;
    }
    setToggle(num);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Step 1: Request upload URL
      const uploadResponse = await axios.post(`${baseUrl}/v1/file/user-url`, {
        extension: file.name.split('.').pop(),
        size: file.size
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const { key, url } = uploadResponse.data.data;

      // Step 2: Upload the file to the provided URL
      await axios.put(url[0], file, {
        headers: {
          'Content-Type': file.type
        }
      });

      // Step 3: Save the uploaded image
      const saveResponse = await axios.post(`${baseUrl}/v1/file/user-save`, {
        key: key,
        extension: file.name.split('.').pop(),
        size: file.size,
        path: "/path"
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update image URL state
      console.log(saveResponse.data.data.profilePhoto);
      setImageUrl(saveResponse.data.data.profilePhoto);

    } catch (error) {
      console.error("Error uploading the file", error);
    }
  };

  return (
    <div className="m-10">
      <div className="flex md:flex-row flex-col gap-4 justify-between items-center">
        <h1 className="text-4xl font-semibold text-center md:text-start">Profile</h1>
        <ul className="steps md:w-1/2">
          <li
            data-content={submitProfile === true ? `✓` : `●`}
            className="step step-neutral"
          >
            Step 1
          </li>
          <li
            data-content={submitPreferences === true ? `✓` : `●`}
            className={`step ${submitProfile ? "step-neutral" : "step-error"}`}
          >
            Step 2
          </li>
          <li
            data-content={submitPaymentInfo === true ? `✓` : `●`}
            className={`step ${
              submitPreferences ? "step-neutral" : "step-error"
            }`}
          >
            Step 3
          </li>
        </ul>
        <div>
          <div className="avatar">
            <div className="w-24 rounded-full cursor-pointer">
              <img src={imageUrl} alt="Profile" />
              <input type="file" className="absolute opacity-0 inset-0 cursor-pointer"  onChange={handleFileChange} />
            </div>
          </div>
        </div>
      </div>
      <div
        role="tablist"
        className="tabs tabs-bordered border rounded-lg p-4 mt-4"
      >
        <a
          role="tab"
          onClick={() => {
            handleToggle(1);
          }}
          className={`tab ${toggle === 1 ? "tab-active" : ""}`}
        >
          Edit Profile
        </a>
        <a
          role="tab"
          onClick={() => {
            handleToggle(2);
          }}
          className={`tab ${toggle === 2 ? "tab-active" : ""} ${
            !submitProfile && "pointer-events-none opacity-50"
          }`}
        >
          Preferences
        </a>
        <a
          role="tab"
          onClick={() => {
            handleToggle(3);
          }}
          className={`tab ${toggle === 3 ? "tab-active" : ""} ${
            !submitPreferences && "pointer-events-none opacity-50"
          }`}
        >
          Payment Info
        </a>
      </div>

      <div>
        {toggle === 1 && (
          <EditProfileForm setSubmitProfile={setSubmitProfile} />
        )}
        {toggle === 2 && (
          <Preferences setSubmitPreferences={setSubmitPreferences} />
        )}
        {toggle === 3 && (
          <PaymentInfo setSubmitPaymentInfo={setSubmitPaymentInfo} />
        )}
      </div>
    </div>
  );
};

export default EditProfile;
