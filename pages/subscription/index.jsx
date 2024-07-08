import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "@/config";

const Subscription = () => {

  const [data, setData] = useState([])

  const getData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/v1/payment`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getData();

  // console.log(data);

  return (
    <div>
      <h1 className="text-5xl font-semibold m-6 text-center md:text-left">
        Subscription
      </h1>
      <div className="mx-6 grid grid-cols-1 gap-5 mt-10">
        <div className="flex flex-col border border-gray-400 rounded-lg p-5">
          <p className="font-semibold text-lg">Plan & Billing</p>
          <p className="text-sm text-gray-400">Manage your plan and payments</p>
        </div>
        <div className="flex flex-col border border-gray-400 rounded-lg p-5">
          <div className="flex flex-row justify-between m-5">
            <p className="font-semibold text-lg">Active membership</p>
            <div className="text-sm flex gap-x-2">
              <span className=" btn btn-xs btn-circle btn-outline font-semibold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
              <span className="text-sm font-semibold">Manage membership</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 p-5 mx-20 relative border border-gray-400 rounded-lg">
            <h1 className="font-semibold text-lg">{data?.currentSubscription?.type.toUpperCase()}</h1>
            <p className="text-sm font-semibold">{data?.currentSubscription?.duration === 4 ? "Quarterly" : data?.currentSubscription?.duration === 12 ? "Annually" : "Monthly"}</p>
            <p className="text-sm flex  gap-x-2">
              <span className="font-semibold">Remaining Time:</span>
              <span className="text-gray-400">{data?.currentSubscription?.remainingTime} mins</span>
            </p>
            <p className="text-sm flex  gap-x-2">
              <span className="font-semibold">Purchase Date:</span>
              <span className="text-gray-400">{data?.currentSubscription?.createdAt.slice(0, 10)}</span>
            </p>
            <p className="text-sm font-semibold">{data?.currentSubscription?.status.toUpperCase()}</p>
            {/* <button className="btn absolute top-3 right-3 bg-[#081F5C] text-white hover:bg-white hover:text-[#081F5C] hover:border-[#081F5C]">
              Cancel subscription
            </button>
            <button className="btn absolute bottom-3 right-3 btn-outline border-[#081F5C] text-[#081F5C] hover:bg-[#081F5C] hover:text-white">
              Manage payments
            </button> */}
          </div>
        </div>
        <div className="flex flex-col border border-gray-400 rounded-lg p-5">
          <div className="flex flex-row justify-between m-5">
            <p className="font-semibold text-lg">Purchase history</p>
          </div>
          <div className="flex flex-col gap-3 p-5 mx-20 relative border border-gray-400 rounded-lg">
            {data?.history?.map((item) => (
            <div>
              <h1 className="font-semibold text-lg">{item.type.toUpperCase()}</h1>
              <p className="text-sm flex  gap-x-2">
              <span className="font-semibold">Purchase Date:</span>
              <span className="text-gray-400">{item.createdAt.slice(0, 10)}</span>
            </p>
            <p className="text-sm font-semibold text-gray-400">{item.status.toUpperCase()}</p>
              <p className="text-sm text-gray-400">{item.duration === 4 ? "Quarterly" : item.duration === 12 ? "Annually" : "Monthly"}</p>
              <div className="divider"></div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
