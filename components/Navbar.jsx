"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../Assets/logo.png";
// import { useUserData } from "../config";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  // const allData = useUserData();
  const [userData, setUserData] = useState({});
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      setUserData({
        name: localStorage.getItem("name") || "",
        email: localStorage.getItem("email") || "",
        profilePhoto: localStorage.getItem("profilePhoto") || "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?w=740&t=st=1717239089~exp=1717239689~hmac=a9d545fd4d72cf1418c9d0085aa91c7f6c60bd4d8e2fe84d5dd5a94e2350dc4d",
      });
    }
  }, [token]);



  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href={"/about"}>About Us</Link>
            </li>
            <li>
              <Link href={"/resources"}>Resources</Link>
            </li>
            <li>
              <Link href={"/pricing"}>Pricing</Link>
            </li>
            <li>
              <Link href={"/test"}>Test</Link>
            </li>
            <li>
              <Link href={"/subscription"}>Subscription</Link>
            </li>
          </ul>
        </div>
        <Image src={Logo} alt="logo" className="w-[150px]" />
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 ">
          <li>
            <Link href={"/about"}>About Us</Link>
          </li>
          <li>
            <Link href={"/resources"}>Resources</Link>
          </li>
          <li>
            <Link href={"/pricing"}>Pricing</Link>
          </li>
          <li>
            <Link href={"/test"}>Test</Link>
          </li>
          <li>
            <Link href={"/subscription"}>Subscription</Link>
          </li>
        </ul>
      </div>
      {token ? (
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-16 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  loading="lazy"
                  src={userData.profilePhoto}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow md:bg-gradient-to-b md:from-[#000000]/70 bg-black text-white rounded-box md:w-80 w-[96vw] divide-y"
            >
              <li>
                <a className="justify-between">
                  <div className="flex">
                    <img
                      className="w-10 rounded-full"
                      alt="Avatar"
                      loading="lazy"
                      src={userData.profilePhoto}
                    />
                    <div className="ml-4">
                      <div className="font-bold">
                        {userData.name}
                        <span className="badge ml-4">Pro</span>
                      </div>
                      <div className="text-sm opacity-50">{userData.email}</div>
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <Link href={"/edit-profile"}>Edit Profile</Link>
              </li>
              <li>
                <a>Check Your Level</a>
              </li>
              <li>
                <a>Manage Subscription</a>
              </li>
              <li>
                <a>Preferences</a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a
                  onClick={() => {
                    localStorage.clear();
                    location.reload();
                  }}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="navbar-end">
          <button
            className="btn text-white w-36 bg-[#130F26]"
            onClick={() => router.push("/signin")}
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
