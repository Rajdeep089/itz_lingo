import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { baseUrl } from '@/config'

const Card = () => {

  const router = useRouter();
  const { id } = router.query;

    const [data, setData] = useState({})

    const getData = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`${baseUrl}/v1/phrases/${id}`, {
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

    
  return (
    <div className="card lg:card-side bg-base-100 shadow-xl m-5">
  <figure className="lg:w-1/2 w-full">
    <img
      src={data.imageUrl}
      alt="Album" />
  </figure>
  <div className="flex flex-col p-10 gap-5">
    <h2 className="font-bold text-4xl mb-6">{data.title}</h2>
    <p><span className='font-semibold text-lg '>Meaning:</span> {data.meaning}</p>
    <p><span className='font-semibold text-lg '>Example:</span> {data.example}</p>
    <p><span className='font-semibold text-lg '>Level:</span> {data.level}</p>
  </div>
</div>
  )
}

export default Card