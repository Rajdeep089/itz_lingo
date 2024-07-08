"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { baseUrl } from "@/config";

const Card = () => {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState({});

  const getData = async () => {
    if (!id) return;
    try {
      const response = await axios.get(`${baseUrl}/v1/conversations/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(response.data.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  // console.log(data);

  return (
    <div className="m-5 py-4 rounded-xl shadow-xl">
      <p className="text-center font-semibold">Scenario:</p>
      <h1 className="text-center font-semibold text-3xl my-4">{data.title}</h1>
      <img
        src={data.imageUrl}
        alt="image"
        className="rounded-xl md:w-2/3 mx-auto shadow-xl"
      />
       <div className="divider md:w-2/3 md:mx-auto mx-2"></div>
      <div className="md:w-2/3 md:mx-auto rounded-xl shadow-xl">
        {data.conversation && data.conversation.map((item, index) => (
          <div key={index} className={`chat  ${item.speaker === "Person A" ? "chat-start" : "chat-end"}`}>
            <div className="chat-image avatar">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content w-12 rounded-full">
                  <span>{item.speaker === "Person A" ? "A" : "B"}</span>
                </div>
              </div>
            </div>
            <div className="chat-header">{item.speaker === "Person A" ? "Person A" : "Person B"}</div>
            <div className="chat-bubble md:w-1/2">{item.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
