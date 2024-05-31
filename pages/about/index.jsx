import React from 'react'
import 'tailwindcss/tailwind.css'
import L1 from '../../Assets/L1.png'
import L2 from '../../Assets/L2.png'
import L3 from '../../Assets/L3.png'
import L4 from '../../Assets/L4.png'
import L5 from '../../Assets/L5.png'
import L6 from '../../Assets/L6.png'
import A1 from '../../Assets/A-1.png'
import A2 from '../../Assets/A-2.png'
import A3 from '../../Assets/A-3.png'
import BT1 from '../../Assets/bgt-1.png'
import BT2 from '../../Assets/bgt-2.png'
import D1 from '../../Assets/D1.png'
import D2 from '../../Assets/D2.png'
import D3 from '../../Assets/D3.png'
import T1 from '../../Assets/T1.png'
import T2 from '../../Assets/T2.png'
import T3 from '../../Assets/T3.png'
import Image from 'next/image'

const About = () => {
  return (
    <>
    <div className='bg-[#081F5C]/70'>
      <Image src={L1} alt="L1" width="auto" height="auto" className="max-w-full absolute right-0 opacity-90"/>
      <h1 className='text-white md:text-5xl text-xl text-center py-20 underline decoration-1 underline-offset-[20px]'>ITZLINGO FEATURES</h1>
      {/* Section 1 */}
      <div className='w-full '>
      <Image src={BT1} alt="BT1" width="auto" height="auto" priority={true} className="absolute right-0 z-0"/>
        <div className='grid grid-cols-2 w-[80%] mx-auto z-30'>

        <div className='flex flex-col justify-around md:h-1/3 my-auto gap-y-4'>
          <h4 className='text-white md:text-3xl text-base font-serif'>Personalized Learning Paths</h4>
          <div className='border-2 md:w-80 border-[#081F5C]'></div>
          <p className='text-white/70 text-xs md:text-base'>Tailored learning journeys for every user's proficiency level and goals. Regular improvements based on user feedback and advancements. Badges, rewards, and leaderboards for  motivation and fun learning.</p>
          <button className='btn text-white bg-[#130F26] btn-sm md:btn-md md:w-1/4 w-2/3 text-xs md:text-base'>Get Demo</button>
        </div>
        <div>
          <Image src={A1} alt="A1" width="auto" height="auto" className="w-full"/>
          {/* <Image src={BT1} alt="BT1" className="w-full"/> */}
        </div>
      </div>
      </div>

      {/* Section 2 */}
      <div className='w-full mt-12'>
      <Image src={L2} alt="L2" width="auto" height="auto" className="absolute left-0 z-0 h-full w-auto opacity-90"/>
        <div className='grid grid-cols-2 w-[80%] mx-auto z-30'>

        <div className='flex flex-col items-end justify-around md:h-1/3 my-auto gap-y-4'>
          <h4 className='text-white md:text-3xl text-end font-serif'>Interactive Resources</h4>
          <div className='border-2 md:w-80 w-full  border-[#081F5C]'></div>
          <p className='text-white/70 text-end text-xs md:text-base'>Real-time conversations with language  partners for immersive practice. Engaging exercises, quizzes, and multimedia content to enhance learning.</p>
          <button className='btn text-white bg-[#130F26] btn-sm md:btn-md w-2/3 md:w-1/4 text-xs md:text-base'>View Resources</button>
        </div>
        <div className='order-first'>
          <Image src={A2} alt="A2" width="auto" height="auto" className="md:w-2/3 w-full"/>
          {/* <Image src={BT1} alt="BT1" className="w-full"/> */}
        </div>
      </div>
      </div>
      
      {/* Section 3 */}
      <div className='w-full'>
      <Image src={BT2} alt="BT2" width="auto" height="auto" className="absolute right-0 z-0"/>
      <Image src={L3} alt="L3" width="auto" height="auto" className="absolute right-0 z-30 opacity-90 h-full w-auto"/>
        <div className='grid grid-cols-2 w-[80%] mx-auto z-30'>

        <div className='flex flex-col justify-around md:h-1/3 my-auto gap-y-4'>
          <h4 className='text-white md:text-3xl text-base font-serif'>Personalized Learning Paths</h4>
          <div className='border-2 md:w-80 border-[#081F5C]'></div>
          <p className='text-white/70 text-xs md:text-base'>Tailored learning journeys for every user's proficiency level and goals. Regular improvements based on user feedback and advancements. Badges, rewards, and leaderboards for  motivation and fun learning.</p>
          <button className='btn text-white bg-[#130F26] btn-sm md:btn-md md:w-1/4 w-2/3 text-xs md:text-base'>Get Demo</button>
        </div>
        <div className='flex justify-end w-full'>
          <Image src={A3} alt="A3" width="auto" height="auto" className="md:w-2/3 w-full"/>
          {/* <Image src={BT1} alt="BT1" className="w-full"/> */}
        </div>
      </div>
      </div>

      {/* Section 4 */}
      <div className='flex flex-col items-center justify-around mt-10 gap-y-4 relative z-50'>
          <h4 className='text-white md:text-5xl text-2xl relative z-50'>About Us</h4>
          <div className='border-2 md:w-20 w-10 relative z-50'></div>
          <p className='text-white text-center text-xs md:text-base w-[70%] relative z-50'>Welcome to ItzLingo! where our mission is to transform English learning intoan accessible and engaging experience. We're dedicated to fostering a supportive community where genuine learners can connect, practice, and excel. Through innovative technology and personalized resources, we empower learners to achieve fluency with confidence. Join us on this journey to unlock the power of communication and expand your horizons through thebeauty of the English language.</p>
          <button className='btn text-white bg-[#130F26] btn-sm md:btn-md w-1/3 md:w-1/6 text-xs md:text-base relative z-50'>See More</button>
          <Image src={L4} alt="L4" width="auto" height="auto" className="absolute mt-60 right-0 left-0 mx-auto z-0 opacity-90"/>
        </div>

        {/* Section 5 */}
        <div className='flex flex-col items-center justify-around mt-10 gap-y-4 relative z-50'>
          <h4 className='text-white md:text-5xl text-2xl'>How We’re Different?</h4>
          <div className='border-2 md:w-20 w-10 '></div>
          <div className='grid md:grid-cols-3 grid-cols-1 gap-6 w-full md:w-[80%]'>
            <Image src={D1} alt="D1" width="auto" height="auto" className="md:w-full w-[80%] mx-auto bg-gradient-to-b from-[#000000]/50 rounded-xl px-4 py-8"/>
            <Image src={D2} alt="D2" width="auto" height="auto" className="md:w-full w-[80%] mx-auto bg-gradient-to-b from-[#000000]/50 rounded-xl px-4 py-8"/>
            <Image src={D3} alt="D3" width="auto" height="auto" className="md:w-full w-[80%] mx-auto bg-gradient-to-b from-[#000000]/50 rounded-xl px-4 py-8"/>
            <Image src={L5} alt="L5" width="auto" height="auto" className="absolute left-0 z-0 opacity-90"/>
            <Image src={L6} alt="L6" width="auto" height="auto" className="absolute right-0 z-0 opacity-90"/>
          </div>
        </div>


        

        {/* Section 6 */}
        <div className='flex flex-col items-center justify-around mt-10 gap-y-4 relative z-50'>
          <h4 className='text-white md:text-5xl text-2xl'>What our users say about us?</h4>
          <div className='grid md:grid-cols-3 grid-cols-1 gap-6 w-full md:w-[80%] mt-6'>
            <Image src={T1} alt="T1" width="auto" height="auto" className="md:w-full w-[80%] mx-auto scale-90"/>
            <Image src={T2} alt="T2" width="auto" height="auto" className="md:w-full w-[80%] mx-auto "/>
            <Image src={T3} alt="T3" width="auto" height="auto" className="md:w-full w-[80%] mx-auto scale-90"/>
          </div>
        </div>

      
    </div>
    </>
  )
}

export default About