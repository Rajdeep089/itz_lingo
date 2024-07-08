import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { baseUrl } from '@/config';
import Link from 'next/link';

const Conversations = () => {

  const [data, setData] = useState([])

  const getData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/v1/conversations/title`, {
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
  }, []);

  return (
    <div className="mb-10">
    <h1 className="md:text-5xl text-3xl my-10 mx-5 font-semibold">Conversations</h1>
    <div className='grid grid-cols-4 gap-4 '>
      {data.map((item) => (
      <Link href={`/resources/conversations/${item.id}`} key={item.id} className="flex justify-center items-center">
                <div className="relative">
                  <img src={item.imageUrl} className="rounded-box w-[320px]" alt={item.title} />
                  <div className="absolute bottom-0 text-white p-5">
                    <p className="text-xl font-semibold my-1">{item.title}</p>
                  </div>
                </div>
              </Link >
    ))}
    </div>
    </div>
  )
}

export default Conversations