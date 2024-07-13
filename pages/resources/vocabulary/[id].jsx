import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { baseUrl } from '@/config'

const Card = () => {

  const router = useRouter();
  const { id } = router.query;

    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true);

    const getData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/v1/vocabulary/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setData(response.data.data);
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      getData();
    }, [id]);

    console.log(data)

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      );
    }
    
  return (
    <div className="card bg-base-100 shadow-xl m-5 p-4">
    <h1 className="text-center font-semibold text-3xl my-4">{data.title}</h1>
    <p className="text-center text-lg mb-4">Category: {data.category}</p>
    <p className="text-center text-lg mb-4">Level: {data.level}</p>
    <img
      src={data.imageUrl}
      alt="Food and Cooking"
      className="rounded-xl md:w-2/3 mx-auto shadow-xl"
    />
    <div className="divider md:w-4/5 md:mx-auto mx-2"></div>
    <h2 className="text-2xl font-semibold mt-8 mb-4">Vocabulary:</h2>
    <div className="md:w-2/3 md:mx-auto">
      {data.vocabulary && Object.entries(data.vocabulary).map(([term, definition], index) => (
        <div key={index} className="mb-2">
          <span className="font-bold">{term}:</span> {definition}
        </div>
      ))}
    </div>
  </div>
  )
}

export default Card