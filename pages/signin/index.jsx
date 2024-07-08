import React, { useEffect, useState } from "react";
import axios from "axios";
import GIcon from "../../Assets/google-color-icon.svg";
import FIcon from "../../Assets/facebook.svg";
import Image from "next/image";
import Logo from "../../Assets/Untitled.gif"
import { useRouter } from "next/navigation";
import { baseUrl, fetchUserData } from "../../config/index";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loginData, setLoginData] = useState({});

  const router = useRouter();

  const login = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/v1/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // console.log("Response:", response.data);

      if (response.data) {
        const { token, data } = response.data;
        const { id, name } = data;

        localStorage.setItem("token", token);
        localStorage.setItem("userId", id);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);

        // Fetch user data and store it in localStorage
        await fetchUserData(token);

        setLoginError(false);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      setLoginError(true);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full">
      <div className="">
        <div className="grid grid-cols-1 w-[80%] mx-auto md:my-10 my-20 md:h-[80%] gap-2">
          <h1 className="text-3xl font-semibold mb-6 text-center md:text-left">
            Log In
          </h1>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              className="grow"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 hover:cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </label>
          <button
            onClick={login}
            className="btn btn-success text-white md:w-1/4 w-full mx-auto bg-[#081F5C]"
          >
            Log In
          </button>
          {loginError && (
            <div id="loginError" className="alert alert-error shadow-lg mt-6">
              Incorrect email or password!
            </div>
          )}
          <p className="text-end font-semibold hover:underline hover:cursor-pointer">
            Forgot Password?
          </p>
          <div className="divider">OR</div>
          <button className="btn btn-bordered md:w-1/2 w-full mx-auto">
            <Image
              src={GIcon}
              alt="GIcon"
              width="auto"
              height="auto"
              className="w-5 h-5"
            />
            <span className="ml-2">Continue with Google</span>
          </button>
          <button className="btn btn-bordered md:w-1/2 w-full mx-auto">
            <Image
              src={FIcon}
              alt="GIcon"
              width="auto"
              height="auto"
              className="w-5 h-5"
            />
            <span className="ml-2">Continue with Facebook</span>
          </button>
          <p className="text-center text-gray-500">
            Don't have an account?{" "}
            <span
              className="text-yellow-500 font-bold hover:cursor-pointer"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
      <div className="bg-[#081F5C] md:flex hidden h-screen">
        {/* <div role="tablist" className="tabs mt-6">
          <a role="tab" className="tab text-white">
            Home
          </a>
          <a role="tab" className="tab tab-active text-white">
            About Us
          </a>
          <a role="tab" className="tab text-white">
            Pricing
          </a>
        </div> */}

        <Image
          src={Logo}
          alt="logo"
          width="auto"
          height="auto"
          className="w-full m-auto"
          unoptimized={true}
        />

      </div>
    </div>
  );
};

export default SignIn;
