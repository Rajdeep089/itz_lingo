import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "@/config";
import L1 from "../../Assets/L1.png";
import L2 from "../../Assets/L2.png";
import L3 from "../../Assets/L3.png";
import L4 from "../../Assets/L4.png";
import L5 from "../../Assets/L5.png";
import L6 from "../../Assets/L6.png";
import A1 from "../../Assets/A-1.png";
import A2 from "../../Assets/A-2.png";
import A3 from "../../Assets/A-3.png";
import BT1 from "../../Assets/bgt-1.png";
import BT2 from "../../Assets/bgt-2.png";
import D1 from "../../Assets/D1.png";
import D2 from "../../Assets/D2.png";
import D3 from "../../Assets/D3.png";
import T1 from "../../Assets/T1.png";
import T2 from "../../Assets/T2.png";
import T3 from "../../Assets/T3.png";
import Image from "next/image";
import { useRouter } from "next/router";

const About = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [feedback, setFeedback] = useState("")
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/v1/contact-us`, formData);
      console.log(response.data);
      setFeedback(response.data.message);
      setFormData({
        name: "",
        email: "",
        message: "",
      })
      
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <div className="bg-[#081F5C]/70">
        <Image
          src={L1}
          alt="L1"
          width="auto"
          height="auto"
          className="max-w-full absolute right-0 opacity-90"
        />
        <h1 className="text-white md:text-5xl text-xl text-center py-20 underline decoration-1 underline-offset-[20px]">
          ITZLINGO FEATURES
        </h1>
        {/* Section 1 */}
        <div className="w-full ">
          <Image
            src={BT1}
            alt="BT1"
            width="auto"
            height="auto"
            priority={true}
            className="absolute right-0 z-0"
          />
          <div className="grid grid-cols-2 w-[80%] mx-auto z-30">
            <div className="flex flex-col justify-around  my-auto gap-y-4">
              <h4 className="text-white md:text-3xl text-base font-serif">
                Personalized Learning Paths
              </h4>
              <div className="border-2 md:w-80 border-[#081F5C]"></div>
              <p className="text-white/70 text-xs md:text-base">
                Tailored learning journeys for every user's proficiency level
                and goals. Regular improvements based on user feedback and
                advancements. Badges, rewards, and leaderboards for motivation
                and fun learning.
              </p>
              <button className="btn text-white bg-[#130F26] btn-sm md:btn-md md:w-1/4 w-2/3 text-xs md:text-base">
                Get Demo
              </button>
            </div>
            <div>
              <Image
                src={A1}
                alt="A1"
                width="auto"
                height="auto"
                className="w-full"
              />
              {/* <Image src={BT1} alt="BT1" className="w-full"/> */}
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="w-full mt-12">
          <Image
            src={L2}
            alt="L2"
            className="absolute left-0 z-0 h-full w-auto opacity-90"
          />
          <div className="grid grid-cols-2 w-[80%] mx-auto z-30">
            <div className="flex flex-col items-end justify-around  my-auto gap-y-4">
              <h4 className="text-white md:text-3xl text-end font-serif">
                Interactive Resources
              </h4>
              <div className="border-2 md:w-80 w-full  border-[#081F5C]"></div>
              <p className="text-white/70 text-end text-xs md:text-base">
                Real-time conversations with language partners for immersive
                practice. Engaging exercises, quizzes, and multimedia content to
                enhance learning.
              </p>
              <button
                onClick={() => router.push("/resources")}
                className="btn text-white bg-[#130F26] btn-sm md:btn-md w-2/3 md:w-1/4 text-xs md:text-base"
              >
                View Resources
              </button>
            </div>
            <div className="order-first">
              <Image src={A2} alt="A2" className="md:w-2/3 w-full" />
              {/* <Image src={BT1} alt="BT1" className="w-full"/> */}
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="w-full">
          <Image src={BT2} alt="BT2" className="absolute right-0 z-0" />
          <Image
            src={L3}
            alt="L3"
            className="absolute right-0 z-30 opacity-90 h-full w-auto"
          />
          <div className="grid grid-cols-2 w-[80%] mx-auto z-30">
            <div className="flex flex-col justify-around my-auto gap-y-4">
              <h4 className="text-white md:text-3xl text-base font-serif">
                Personalized Learning Paths
              </h4>
              <div className="border-2 md:w-80 border-[#081F5C]"></div>
              <p className="text-white/70 text-xs md:text-base">
                Tailored learning journeys for every user's proficiency level
                and goals. Regular improvements based on user feedback and
                advancements. Badges, rewards, and leaderboards for motivation
                and fun learning.
              </p>
              <button className="btn text-white bg-[#130F26] btn-sm md:btn-md md:w-1/4 w-2/3 text-xs md:text-base">
                Get Demo
              </button>
            </div>
            <div className="flex justify-end w-full">
              <Image src={A3} alt="A3" className="md:w-2/3 w-full" />
              {/* <Image src={BT1} alt="BT1" className="w-full"/> */}
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="flex flex-col items-center justify-around mt-10 gap-y-4 relative z-50">
          <h4 className="text-white md:text-5xl text-2xl relative z-50">
            About Us
          </h4>
          <div className="border-2 md:w-20 w-10 relative z-50"></div>
          <p className="text-white text-center text-xs md:text-base w-[70%] mx-auto relative z-50">
            Welcome to ItzLingo! where our mission is to transform English
            learning intoan accessible and engaging experience. We're dedicated
            to fostering a supportive community where genuine learners can
            connect, practice, and excel. Through innovative technology and
            personalized resources, we empower learners to achieve fluency with
            confidence. Join us on this journey to unlock the power of
            communication and expand your horizons through thebeauty of the
            English language.
          </p>
          <button
            onClick={() => document.getElementById("contact-modal").showModal()}
            className="btn text-white bg-[#130F26] btn-sm md:btn-md w-1/3 md:w-1/6 text-xs md:text-base relative z-50"
          >
            Contact Us
          </button>
          <Image
            src={L4}
            alt="L4"
            priority={true}
            className="absolute w-auto mt-60 right-0 left-0 mx-auto z-0 opacity-90"
          />
        </div>

        <dialog id="contact-modal" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-[#081F5C]">
                ✕
              </button>
            </form>
            {feedback ? (
              <form method="dialog" className="flex flex-col">
                 <h1 className="font-bold text-3xl text-center my-16 text-[#081F5C]">{feedback}</h1>
                <button
                  onClick={() => {setFeedback(null); document.getElementById("contact-modal").close();}}
                  className="btn text-white bg-[#081F5C] hover:bg-white hover:text-[#081F5C] hover:border-[#081F5C] border-2 w-1/3 mx-auto my-4">
                  Okay
                </button>
              </form>
            ) : (
              <div>
              <h1 className="font-bold text-3xl text-[#081F5C]">Contact Us</h1>
            <h3 className="py-4 font-sans text-lg text-gray-400">
              We are always here to help what you need
            </h3>
            <input
              type="text"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              value={formData.name}
              placeholder="Name"
              className="input input-bordered w-full my-2"
            />
            <input
              type="email"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              value={formData.email}
              placeholder="Email"
              className="input input-bordered w-full my-2"
            />
            <label className="input input-bordered  h-20 flex items-start py-2 gap-2 my-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="#081F5C"
                className="size-4 opacity-70 mt-[5px] "
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <textarea
                type="text"
                rows={10}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                value={formData.message}
                className="grow resize-none outline-none h-full"
                placeholder="Email"
              />
            </label>
            <button onClick={handleSubmit} className="btn text-white bg-[#081F5C] hover:bg-white hover:text-[#081F5C] hover:border-[#081F5C] border-2 w-full my-4">Submit</button>
            </div>
            )}
            
            
          </div>
        </dialog>

        {/* Section 5 */}
        <div className="flex flex-col items-center justify-around mt-10 gap-y-4 relative z-50">
          <h4 className="text-white md:text-5xl text-2xl">
            How We're Different?
          </h4>
          <div className="border-2 md:w-20 w-10 "></div>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-6 w-full md:w-[80%] md:mx-auto">
            <Image
              src={D1}
              alt="D1"
              className="md:w-full w-[80%] mx-auto bg-gradient-to-b from-[#000000]/50 rounded-xl px-4 py-8"
            />
            <Image
              src={D2}
              alt="D2"
              className="md:w-full w-[80%] mx-auto bg-gradient-to-b from-[#000000]/50 rounded-xl px-4 py-8"
            />
            <Image
              src={D3}
              alt="D3"
              className="md:w-full w-[80%] mx-auto bg-gradient-to-b from-[#000000]/50 rounded-xl px-4 py-8"
            />
          </div>
        </div>

        {/* Section 6 */}
        <div className="flex flex-col items-center justify-around mt-10 gap-y-4 relative z-50">
          <Image
            src={L5}
            alt="L5"
            className="absolute w-auto left-0 z-0 opacity-90 h-[100%]"
          />
          <Image
            src={L6}
            alt="L6"
            className="absolute w-auto right-0 z-0 opacity-90 h-[100%]"
          />
          <h4 className="text-white md:text-5xl text-2xl">
            What our users say about us?
          </h4>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-6 w-full md:w-[80%] mt-6">
            <Image
              src={T1}
              alt="T1"
              className="md:w-full w-[80%] mx-auto scale-90"
            />
            <Image src={T2} alt="T2" className="md:w-full w-[80%] mx-auto " />
            <Image
              src={T3}
              alt="T3"
              className="md:w-full w-[80%] mx-auto scale-90"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
