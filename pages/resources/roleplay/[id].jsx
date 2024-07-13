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
        const response = await axios.get(`${baseUrl}/v1/roleplay/${id}`, {
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

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    
  return (
    <div className="m-5 p-4 rounded-xl shadow-xl">
      
  <p className="text-center mt-4"><b>Level:</b> {data.level}</p>
  <p className="text-center font-bold">Scenario:</p>
  <h1 className="text-center font-semibold text-3xl my-4">{data.title}</h1>
  <img
    src={data.imageUrl}
    alt="image"
    className="rounded-xl md:w-2/3 mx-auto shadow-xl"
  />
  <div className="divider md:w-2/3 md:mx-auto mx-2"></div>
  
  <p className="md:w-2/3 md:mx-auto my-4 text-center">{data.setting}</p>
  
  <div className="md:w-2/3 md:mx-auto rounded-xl shadow-xl">
    {data.conversation && data.conversation.map((item, index) => (
      <div key={index} className={`chat ${item.speaker === "Person A" ? "chat-start" : "chat-end"}`}>
        <div className="chat-image avatar">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content w-12 rounded-full">
              <span>{item.speaker === "Person A" ? "A" : "B"}</span>
            </div>
          </div>
        </div>
        <div className="chat-header font-semibold">{item.speaker === "Person A" ? "Person A" : "Person B"}</div>
        <div className="chat-bubble">{item.message}</div>
      </div>
    ))}
  </div>
  
  <p className="md:w-2/3 md:mx-auto my-4 text-center">{data.ending}</p>
  
  <div className="divider md:w-2/3 md:mx-auto mx-2"></div>
  
  <h2 className="text-2xl font-semibold mt-8 mb-4 text-center">Vocabulary:</h2>
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