import React, { useRef, useCallback, useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "@/config";
import CategoryComponent from "./category";

const Resources = ({
  onScroll,
  onClick,
  onCategoryChange,
  selectedCategory,
  onCardSelect,
  selectedCard,
}) => {
  const [resources, setResources] = useState({
    stories: [],
    vocabulary: [],
    roleplay: [],
    describeMe: [],
    conversations: [],
    phrases: [],
  });
  // const [selectedCategory, setSelectedCategory] = useState(null);

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
    }
  };

  useEffect(() => {
    fetchData("stories", "stories");
    fetchData("vocabulary", "vocabulary");
    fetchData("roleplay", "roleplay");
    fetchData("describeme", "describeMe");
    fetchData("conversations", "conversations");
    fetchData("phrases", "phrases");
  }, []);

  const carouselRefs = useRef([]);

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

  const handleClick = useCallback(
    (event, category, itemId) => {
      if (onClick) {
        onClick(category, itemId);
      }
      if (itemId === "header") {
        onCategoryChange(category);
      }
    },
    [onClick, onCategoryChange]
  );

  const handleItemClick = useCallback(
    (category, id) => {
      onCardSelect(category, id);
      console.log("Card clicked:", category, id);
    },
    [onCardSelect]
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
    <div className="mb-10 relative scroll-smooth">
      <h1 className="md:text-5xl text-3xl my-10 mx-5 font-semibold">
        Resources
      </h1>
      {categories.map((category, index) => (
        <div key={category.key} className="flex flex-col">
          <h2
            onClick={(e) => {
              handleClick(e, category.key, "header");
            }}
            className="md:text-3xl text-xl my-10 mx-5 font-semibold cursor-pointer"
            data-category={category.key}
            data-item-id="header"
          >
            {category.label}
          </h2>
          <div
            ref={(el) => (carouselRefs.current[index] = el)}
            onScroll={() => handleScroll(index)}
            className="carousel carousel-center p-4 space-x-4 bg-gray-200 rounded-box mx-5"
          >
            {resources[category.key].map((item) => (
              <div
                key={`${item.id}-${
                  selectedCard && selectedCard.id === item.id
                    ? "selected"
                    : "not-selected"
                }`}
                className={`carousel-item cursor-pointer ${
                  selectedCard && selectedCard.id === item.id
                    ? ""
                    : ""
                }`}
                onClick={() => handleItemClick(category.key, item.id)}
                data-category={category.key}
                data-item-id={item.id}
              >
                <div className="relative">
                  <img
                    src={item.imageUrl}
                    className="rounded-box w-[300px]"
                    alt={item.title}
                  />
                  <div className="absolute bottom-0 text-white p-5">
                    <p className="text-xl font-semibold my-1">{item.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {selectedCategory && (
        <CategoryComponent
          category={selectedCategory}
          onClose={() => onCategoryChange(null)}
          onCardSelect={onCardSelect}
          selectedCard={selectedCard}
        />
      )}
    </div>
  );
};

export default Resources;
