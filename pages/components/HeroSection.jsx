"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import logotext from "../../Assets/hero-text.png";
import heroright from "../../Assets/hero-left.png";
import { useUserData } from "@/config";

const HeroSection = () => {
  const allData = useUserData(); 
  // const token = allData?.token;
  // console.log(token.length > 0);

  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return (
    <div className="bg-[#081F5C] text-white">
      <div className="hero lg:h-[80vh]">
        <div className="hero-content flex-col-reverse lg:flex-row-reverse">
          
            <Image src={heroright} alt="heroright" priority={true} className="max-w-full md:max-w-xs"/>
          <div>
            <Image
            src={logotext}
            alt="logotext"
            className="max-w-full md:max-w-sm"
          />
            <p className="py-6 text-xl">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            {token ? (
              <Link href="/chats"><button className="btn text-white bg-[#130F26] btn-sm lg:btn-md">
                Messages <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
</svg>
              </button></Link>
            ) : (
              <button className="btn text-white bg-[#130F26] btn-sm lg:btn-md">Get Started</button>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
