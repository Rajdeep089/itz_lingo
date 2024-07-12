import React, { useRef, useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { baseUrl } from "@/config";
import axios from "axios";

const ResourceItemSkeleton = () => (
  <div className="carousel-item">
    <div className="relative animate-pulse">
      <div className="rounded-box w-[300px] h-[200px] bg-gray-300"></div>
      <div className="absolute bottom-0 w-full p-5">
        <div className="h-6 bg-gray-400 rounded w-3/4"></div>
      </div>
    </div>
  </div>
);

const Resources = ({ onScroll }) => {
  const [resources, setResources] = useState({
    stories: [],
    vocabulary: [],
    roleplay: [],
    describeMe: [],
    conversations: [],
    phrases: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchData = async (endpoint, category) => {
    try {
      const response = await axios.get(
        `${baseUrl}/v1/${endpoint}/title?limit=7`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setResources((prevResources) => ({
        ...prevResources,
        [category]: response.data.data,
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchData("stories", "stories"),
        fetchData("vocabulary", "vocabulary"),
        fetchData("roleplay", "roleplay"),
        fetchData("describeme", "describeMe"),
        fetchData("conversations", "conversations"),
        fetchData("phrases", "phrases"),
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, []);

  const carouselRefs = useRef([]);

  const scrollCarousel = (index, direction) => {
    const carousel = carouselRefs.current[index];
    if (carousel) {
      const scrollAmount = 300; // Adjust this value as needed
      carousel.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = useCallback(
    (index) => {
      if (onScroll) {
        const scrollPositions = carouselRefs.current.map((ref) =>
          ref ? ref.scrollLeft : 0
        );
        onScroll(scrollPositions);
      }
    },
    [onScroll]
  );

  const categories = [
    { key: "describeMe", label: "Describe Me" },
    { key: "vocabulary", label: "Vocabulary" },
    { key: "stories", label: "Short Stories" },
    { key: "roleplay", label: "Roleplay" },
    { key: "conversations", label: "Conversations" },
    { key: "phrases", label: "Phrases" },
  ];

  return (
    <div className="mb-10">
      <h1 className="md:text-5xl text-3xl my-10 mx-5 font-semibold">
        Resources
      </h1>
      {categories.map((category, index) => (
        <div key={category.key} className="flex flex-col">
          <Link
            href={`/resources/${category.key}`}
            className="md:text-3xl text-xl my-10 mx-5 font-semibold"
          >
            {category.label}
          </Link>
          <div className="relative mx-5">
            <button
              onClick={() => scrollCarousel(index, "left")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <div
              ref={(el) => (carouselRefs.current[index] = el)}
              onScroll={() => handleScroll(index)}
              className="carousel carousel-center p-4 space-x-4 bg-gray-200 rounded-box"
            >
              {loading
                ? // Show skeletons while loading
                  Array(7)
                    .fill()
                    .map((_, i) => <ResourceItemSkeleton key={i} />)
                : resources[category.key].map((item) => (
                    <Link
                      href={`/resources/${category.key}/${item.id}`}
                      key={item.id}
                      className="carousel-item"
                    >
                      <div className="relative">
                        <img
                          src={item.imageUrl}
                          className="rounded-box w-[300px]"
                          alt={item.title}
                        />
                        <div className="absolute bottom-0 text-white p-5">
                          <p className="text-xl font-semibold my-1">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>
            <button
              onClick={() => scrollCarousel(index, "right")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Resources;
