import React, { useRef, useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { baseUrl } from "@/config";
import axios from "axios";

const Resources = ({ onScroll }) => {
  const [resources, setResources] = useState({
    stories: [],
    vocabulary: [],
    roleplay: [],
    describeMe: [],
    conversations: [],
    phrases: [],
  });

  const fetchData = async (endpoint, category) => {
    try {
      const response = await axios.get(`${baseUrl}/v1/${endpoint}/title?limit=7`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setResources(prevResources => ({
        ...prevResources,
        [category]: response.data.data,
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    fetchData('stories', 'stories');
    fetchData('vocabulary', 'vocabulary');
    fetchData('roleplay', 'roleplay');
    fetchData('describeme', 'describeMe');
    fetchData('conversations', 'conversations');
    fetchData('phrases', 'phrases');
  }, []);

  const carouselRefs = useRef([]);

  const handleScroll = useCallback(
    index => {
      if (onScroll) {
        const scrollPositions = carouselRefs.current.map(ref => (ref ? ref.scrollLeft : 0));
        onScroll(scrollPositions);
      }
    },
    [onScroll]
  );

  const categories = [
    { key: 'describeMe', label: 'Describe Me' },
    { key: 'vocabulary', label: 'Vocabulary' },
    { key: 'stories', label: 'Short Stories' },
    { key: 'roleplay', label: 'Roleplay' },
    { key: 'conversations', label: 'Conversations' },
    { key: 'phrases', label: 'Phrases' },
  ];

  return (
    <div className="mb-10">
      <h1 className="md:text-5xl text-3xl my-10 mx-5 font-semibold">Resources</h1>
      {categories.map((category, index) => (
        <div key={category.key} className="flex flex-col">
          <Link href={`/resources/${category.key}`} className="md:text-3xl text-xl my-10 mx-5 font-semibold">
            {category.label}
          </Link>
          <div
            ref={el => (carouselRefs.current[index] = el)}
            onScroll={() => handleScroll(index)}
            className="carousel carousel-center p-4 space-x-4 bg-gray-200 rounded-box mx-5"
          >
            {resources[category.key].map(item => (
              <Link href={`/resources/${category.key}/${item.id}`} key={item.id} className="carousel-item">
                <div className="relative">
                  <img src={item.imageUrl} className="rounded-box w-[300px]" alt={item.title} />
                  <div className="absolute bottom-0 text-white p-5">
                    <p className="text-xl font-semibold my-1">{item.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Resources;
