import React, { useState } from "react";
import Link from "next/link";
import Monthly from "./components/Monthly";
import Annually from "./components/Annually";
import Quaterly from "./components/Quaterly";

const Pricing = () => {
  const [tab, setTab] = useState("monthly");
  return (
    <div className="flex flex-col md:justify-between justify-center">
      <Link
        href="/"
        className="absolute top-5 right-5 btn md:btn-md btn-sm btn-outline btn-circle"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="md:size-6 size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
          />
        </svg>
      </Link>
      <div className="flex flex-col gap-4 md:gap-0">
        <h1 className="md:text-5xl text-2xl font-semibold my-8 ml-8">
          Find Your Perfect Plan
        </h1>
        <div className="flex flex-wrap justify-center gap-4 border p-2 md:w-full max-w-xl mx-auto rounded-xl border-gray-300 transition-all duration-500 ease-out">
          <button
            onClick={() => setTab("monthly")}
            className={`btn md:btn-md btn-sm md:text-base text-xs hover:bg-[#081F5C] hover:text-white ${
              tab === "monthly"
                ? "bg-[#081F5C] text-white"
                : "bg-white text-[#081F5C]"
            }`}
          >
            Billed Monthly
          </button>
          <button
            onClick={() => setTab("quaterly")}
            className={`btn md:btn-md btn-sm md:text-base text-xs hover:bg-[#081F5C] hover:text-white ${
              tab === "quaterly"
                ? "bg-[#081F5C] text-white"
                : "bg-white text-[#081F5C]"
            }`}
          >
            Billed Quaterly
          </button>
          <button
            onClick={() => setTab("annually")}
            className={`btn md:btn-md btn-sm md:text-base text-xs hover:bg-[#081F5C] hover:text-white ${
              tab === "annually"
                ? "bg-[#081F5C] text-white"
                : "bg-white text-[#081F5C]"
            }`}
          >
            Billed Annually
          </button>
        </div>
      </div>

      {/* <div className=''> */}
      {tab === "monthly" && <Monthly />}
      {tab === "quaterly" && <Quaterly />}
      {tab === "annually" && <Annually />}
      {/* </div> */}
    </div>
  );
};

export default Pricing;
