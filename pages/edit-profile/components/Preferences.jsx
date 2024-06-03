import React, { useState,useEffect } from "react";
import MultiRangeSlider from "@/components/MultiRangeSlider/MultiRangeSlider";
import axios from "axios";
import { baseUrl } from "@/config";

const Preferences = (setSubmitPreferences) => {

  const [token, setToken] = useState(null);
  const [formData, setFormData] = useState({
    purpose: "",
    partnerGender: "",
    partnerAgeRange: [0, 80],
  });


  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);




  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${baseUrl}/v1/user/preferences`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      alert("Preferences updated successfully! Now click on Peyment Info tab for next step.");
      setSubmitPreferences(true);
    } catch (error) {
      console.error(error);
    }
  }

  console.log(formData);

  return (
    <div className="w-[95%] border mt-4 rounded-lg mx-auto">
    <form  className="" onSubmit={handleFormSubmit}>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-8 p-4">

        <div className="grid grid-cols-1 gap-6">
        <div className="my-4 ">
          <label className="label label-text text-lg font-semibold">
            Age Range :
          </label>
          <MultiRangeSlider
            min={0}
            max={80}
            onChange={({e, min, max }) => setFormData({ ...formData, partnerAgeRange: [min, max] })}
          />
        </div>
          <div>
          <label className="label label-text text-lg font-semibold">
            Learning Purpose :
          </label>
          <select
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            className="select select-bordered w-full"
          >
            <option value="">Select Purpose</option>
            <option value="academic">Academic</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="conversation">Conversation</option>
          </select>
        </div>
        <div>
          <label className="label label-text text-lg font-semibold">
            Show Me :
          </label>
          <select
            value={formData.partnerGender}
            onChange={(e) => setFormData({ ...formData, partnerGender: e.target.value })}
            className="select select-bordered w-full"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="both">Both</option>
          </select>
        </div>
        </div>
      </div>
      <div className="w-full flex justify-end">
          <button type="submit" className="btn btn-primary w-20 m-4">
          Save
        </button>
        </div>
    </form>
    </div>
  )
}

export default Preferences