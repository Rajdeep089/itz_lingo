// components/CardComponent.js
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { baseUrl } from "@/config";

const CardComponent = ({ category, id, onClose, onScroll, scrollInfo }) => {
  const [cardData, setCardData] = useState(null);
  const [apiCategory, setApiCategory] = useState("");
  const cardContentRef = useRef(null);

  useEffect(() => {
    if (category === "stories") {
      setApiCategory("stories");
    } else if (category === "vocabulary") {
      setApiCategory("vocabulary");
    } else if (category === "roleplay") {
      setApiCategory("roleplay");
    } else if (category === "describeMe") {
      setApiCategory("describeme");
    } else if (category === "conversations") {
      setApiCategory("conversations");
    } else if (category === "phrases") {
      setApiCategory("phrases");
    }
  }, [category]);

  useEffect(() => {
    setCardData(null);
    const fetchCardData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/v1/${apiCategory}/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCardData(response.data.data);
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    };

    fetchCardData();
  }, [category, id, apiCategory]);

  useEffect(() => {
    if (cardContentRef.current && scrollInfo) {
      cardContentRef.current.scrollTop = scrollInfo.scrollTop;
    }
  }, [scrollInfo]);


  const handleCardScroll = () => {
    if (cardContentRef.current && typeof onScroll === 'function') {
      const { scrollTop, scrollHeight, clientHeight } = cardContentRef.current;
      onScroll({ scrollTop, scrollHeight, clientHeight });
    }
  };

  if (!cardData) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative scroll-smooth"
        onScroll={handleCardScroll}
        ref={cardContentRef}>
        {/* <h2 className="text-2xl font-bold mb-4">{cardData.title}</h2>
        <img
          src={cardData.imageUrl}
          alt={cardData.title}
          className="w-full h-64 object-cover mb-4"
        />
        <p className="mb-4">{cardData.content}</p> */}
        {category === "stories" && (
          <div className="m-5 py-4 rounded-xl shadow-xl">
          <h1 className="text-center font-semibold text-3xl my-4">{cardData.title}</h1>
          <img
            src={cardData.imageUrl}
            alt="image"
            className="rounded-xl md:w-2/3 mx-auto shadow-xl"
          />
          <div className="divider md:w-4/5 md:mx-auto mx-2"></div>
          <div
            className="md:w-2/3 md:mx-auto text-left"
            dangerouslySetInnerHTML={{ __html: cardData.description }}
          />
          <h1 className="text-center font-semibold text-3xl mt-8 mb-4">Glossary:</h1>
          <div className="md:w-2/3 md:mx-auto">
          {cardData.glossary && Object.entries(cardData.glossary).map(([term, definition], index) => (
            <div key={index} className="mb-2">
              <span className="font-bold">{term}:</span> {definition}
            </div>
          ))}
        </div>
        </div>
        )}
        {category === "conversations" && (
          <div className="m-5 py-4 rounded-xl shadow-xl">
          <p className="text-center font-semibold">Scenario:</p>
          <h1 className="text-center font-semibold text-3xl my-4">{cardData.title}</h1>
          <img
            src={cardData.imageUrl}
            alt="image"
            className="rounded-xl md:w-2/3 mx-auto shadow-xl"
          />
           <div className="divider md:w-2/3 md:mx-auto mx-2"></div>
          <div className="md:w-2/3 md:mx-auto rounded-xl shadow-xl">
            {cardData.conversation && cardData.conversation.map((item, index) => (
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
        )}

        {category === "roleplay" && (
           <div className="m-5 p-4 rounded-xl shadow-xl">
      
           <p className="text-center mt-4"><b>Level:</b> {cardData.level}</p>
           <p className="text-center font-bold">Scenario:</p>
           <h1 className="text-center font-semibold text-3xl my-4">{cardData.title}</h1>
           <img
             src={cardData.imageUrl}
             alt="image"
             className="rounded-xl md:w-2/3 mx-auto shadow-xl"
           />
           <div className="divider md:w-2/3 md:mx-auto mx-2"></div>
           
           <p className="md:w-2/3 md:mx-auto my-4 text-center">{cardData.setting}</p>
           
           <div className="md:w-2/3 md:mx-auto rounded-xl shadow-xl">
             {cardData.conversation && cardData.conversation.map((item, index) => (
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
           
           <p className="md:w-2/3 md:mx-auto my-4 text-center">{cardData.ending}</p>
           
           <div className="divider md:w-2/3 md:mx-auto mx-2"></div>
           
           <h2 className="text-2xl font-semibold mt-8 mb-4 text-center">Vocabulary:</h2>
           <div className="md:w-2/3 md:mx-auto">
             {cardData.vocabulary && Object.entries(cardData.vocabulary).map(([term, definition], index) => (
               <div key={index} className="mb-2">
                 <span className="font-bold">{term}:</span> {definition}
               </div>
             ))}
           </div>
           
         </div>
        )}
        {category === "describeMe" && (
          <div className="m-5 p-4 rounded-xl shadow-xl">
          <h1 className="text-center font-semibold text-3xl my-4">{cardData.title}</h1>
          <p className="text-center text-lg mb-4"> <span className='font-semibold text-lg '>Level:</span> {cardData.level}</p>
          <img
            src={cardData.imageUrl}
            alt="A Cup of Coffee"
            className="rounded-xl md:w-2/3 mx-auto shadow-xl"
          />
          <div className="divider md:w-4/5 md:mx-auto mx-2"></div>
          <div
          className="md:w-2/3 md:mx-auto text-center"
          dangerouslySetInnerHTML={{ __html: cardData.description }}
        />
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-center">Glossary:</h2>
          <div className="md:w-2/3 md:mx-auto">
            {cardData.glossary && Object.entries(cardData.glossary).map(([term, definition], index) => (
              <div key={index} className="mb-2">
                <span className="font-bold">{term}:</span> {definition}
              </div>
            ))}
          </div>
        </div>
        )}
        {category === "phrases" && (
          <div className="card lg:card-side bg-base-100 shadow-xl m-5">
          <figure className="lg:w-1/2 w-full">
            <img
              src={cardData.imageUrl}
              alt="Album" />
          </figure>
          <div className="flex flex-col p-10 gap-5">
            <h2 className="font-bold text-4xl mb-6">{cardData.title}</h2>
            <p><span className='font-semibold text-lg '>Meaning:</span> {cardData.meaning}</p>
            <p><span className='font-semibold text-lg '>Example:</span> {cardData.example}</p>
            <p><span className='font-semibold text-lg '>Level:</span> {cardData.level}</p>
          </div>
        </div>
        )}
        {category === "vocabulary" && (
           <div className="card bg-base-100 shadow-xl m-5 p-4">
           <h1 className="text-center font-semibold text-3xl my-4">{cardData.title}</h1>
           <p className="text-center text-lg mb-4">Category: {cardData.category}</p>
           <p className="text-center text-lg mb-4">Level: {cardData.level}</p>
           <img
             src={cardData.imageUrl}
             alt="Food and Cooking"
             className="rounded-xl md:w-2/3 mx-auto shadow-xl"
           />
           <div className="divider md:w-4/5 md:mx-auto mx-2"></div>
           <h2 className="text-2xl font-semibold mt-8 mb-4">Vocabulary:</h2>
           <div className="md:w-2/3 md:mx-auto">
             {cardData.vocabulary && Object.entries(cardData.vocabulary).map(([term, definition], index) => (
               <div key={index} className="mb-2">
                 <span className="font-bold">{term}:</span> {definition}
               </div>
             ))}
           </div>
         </div>
        )}
        <button onClick={onClose} className="btn btn-circle absolute top-2 right-2 btn-sm text-lg">
        &times;
        </button>
      </div>
    </div>
  );
};

export default CardComponent;
