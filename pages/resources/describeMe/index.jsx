import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { baseUrl } from '@/config';
import Link from 'next/link';

const DescribeMeSkeleton = () => (
  <div className="flex justify-center items-center animate-pulse">
    <div className="relative">
      <div className="rounded-box w-[320px] h-[200px] bg-gray-300"></div>
      <div className="absolute bottom-0 w-full p-5">
        <div className="h-6 bg-gray-400 rounded w-3/4"></div>
      </div>
    </div>
  </div>
);

const DescribeMe = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getData = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${baseUrl}/v1/describeme/title`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="mb-10">
      <h1 className="md:text-5xl text-3xl my-10 mx-5 font-semibold">Describe Me</h1>
      <div className='grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4'>
        {isLoading ? (
          // Show skeleton loaders while loading
          Array(8).fill().map((_, index) => (
            <DescribeMeSkeleton key={index} />
          ))
        ) : (
          data.map((item) => (
            <Link href={`/resources/describeMe/${item.id}`} key={item.id} className="flex justify-center items-center">
              <div className="relative">
                <img src={item.imageUrl} className="rounded-box w-[320px]" alt={item.title} />
                <div className="absolute bottom-0 text-white p-5">
                  <p className="text-xl font-semibold my-1">{item.title}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default DescribeMe