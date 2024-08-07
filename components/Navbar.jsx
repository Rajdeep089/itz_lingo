"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../Assets/logo.png";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setUserData({
        name: localStorage.getItem("name") || "",
        email: localStorage.getItem("email") || "",
        profilePhoto: localStorage.getItem("profilePhoto") || "",
      });
    }
    setToken(storedToken);
    setIsLoading(false);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

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
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-black/90 text-white rounded-box w-52 divide-y"
          >
            <li>
              <Link href={"/about"}>About Us</Link>
            </li>
            <li>
              <Link href={token ? "/resources" : "/login"}>Resources</Link>
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
            <Link href={token ? "/resources" : "/signin"}>Resources</Link>
          </li>
          <li>
            <Link href={token ? "/pricing" : "/signin"}>Pricing</Link>
          </li>
          <li>
            <Link href={token ? "/test" : "/signin"}>Test</Link>
          </li>
          <li>
            <Link href={token ? "/subscription" : "/signin"}>Subscription</Link>
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
                  src={userData.profilePhoto}
                  className="w-auto h-auto"
                  alt="Avatar"
                  priority="true"
                  width={64}
                  height={64}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow md:bg-black/80 bg-black/90 text-white rounded-box md:w-80 w-[96vw] divide-y"
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
                <Link href={"/test"}>Check Your Level</Link>
              </li>
              <li>
                <Link href={"/subscription"}>Manage Subscription</Link>
              </li>
              {/* <li>
                <a>Preferences</a>
              </li>
              <li>
                <a>Settings</a>
              </li> */}
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
