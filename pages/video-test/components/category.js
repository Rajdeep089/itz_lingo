import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "@/config";

const CategoryComponent = ({
  category,
  onClose,
  onCardSelect,
  selectedCard,
}) => {
  const [data, setData] = useState([]);
  const [apiCategory, setApiCategory] = useState("");

  useEffect(() => {
    if (category) {
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
    }
  }, [category]);

  const getData = async () => {
    if (!apiCategory) return; // Don't make the API call if apiCategory is empty
    try {
      const response = await axios.get(`${baseUrl}/v1/${apiCategory}/title`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, [apiCategory]);

  if (!category) {
    return null; // Or return some placeholder content
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white z-40 scroll-smooth overflow-auto" ref={(el) => el && el.scrollTop === 0 && el.scrollTo(0, 0)}>
      <div className="mb-10">
        <h1 className="md:text-5xl text-3xl my-10 mx-5 font-semibold flex justify-between">
          {category.charAt(0).toUpperCase() + category.slice(1)}
          <button onClick={onClose} className="text-2xl">
            &times;
          </button>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <div
              key={`${item.id}-${
                selectedCard && selectedCard.id === item.id
                  ? "selected"
                  : "not-selected"
              }`}
              onClick={() => onCardSelect(category, item.id)}
              className={`flex justify-center items-center cursor-pointer ${
                selectedCard && selectedCard.id === item.id
                  ? ""
                  : ""
              }`}
            >
              <div className="relative">
                <img
                  src={item.imageUrl}
                  className="rounded-box w-[320px]"
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
    </div>
  );
};

export default CategoryComponent;