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
        const response = await axios.get(`${baseUrl}/v1/describeme/${id}`, {
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

    console.log(data)
    
    return (
      <div className="m-5 p-4 rounded-xl shadow-xl">
        <h1 className="text-center font-semibold text-3xl my-4">{data.title}</h1>
        <p className="text-center text-lg mb-4"> <span className='font-semibold text-lg '>Level:</span> {data.level}</p>
        <img
          src={data.imageUrl}
          alt="A Cup of Coffee"
          className="rounded-xl md:w-2/3 mx-auto shadow-xl"
        />
        <div className="divider md:w-4/5 md:mx-auto mx-2"></div>
        <div
        className="md:w-2/3 md:mx-auto text-center"
        dangerouslySetInnerHTML={{ __html: data.description }}
      />
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-center">Glossary:</h2>
        <div className="md:w-2/3 md:mx-auto">
          {data.glossary && Object.entries(data.glossary).map(([term, definition], index) => (
            <div key={index} className="mb-2">
              <span className="font-bold">{term}:</span> {definition}
            </div>
          ))}
        </div>
      </div>
    );
}

export default Card