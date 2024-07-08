import React from 'react'
import Link from 'next/link'
import Testimg from "../../Assets/test.png"
import Test_icon_1 from "../../Assets/test-icon-1.svg"
import Test_icon_2 from "../../Assets/test-icon-2.png"
import arrow from "../../Assets/arrow.png"
import Image from 'next/image'

const Test = () => {
  return (
    <div className="bg-[#081F5C] h-[115vh] md:h-screen">
      <div className='absolute md:bottom-0 md:top-auto top-10 w-[90%] left-0 right-0 mx-auto'>
        <div className="flex md:flex-row flex-col items-center justify-center">
      <h1 className="text-white md:text-6xl text-3xl font-bold ml-4 leading-relaxed">Verify your English skills. Accelerate your learnings.</h1>
      <Image alt="test" width={400} height={400} src={Testimg} className='md:w-1/3 w-[70%]'/>
    </div>
    <div className='flex md:flex-row flex-col w-full'>
      <div className='flex flex-col md:justify-start justify-center h-full p-5 md:gap-20 gap-10 md:w-2/3 '>
       <Link href="/test/test-page"><button className="btn btn-outline md:w-1/4 text-white bg-[#130F26]">Take Test <Image alt="arrow" width={20} height={20} src={arrow}/></button></Link> 
        <h1 onClick={() => document.getElementById("my_modal_2").showModal()} className='text-white text-xl cursor-pointer'>What can I expect during the test?</h1>
      </div>
      <div className=''>
        <div className='flex flex-col text-white p-5 gap-10'>
        <div className='flex flex-row justify-start items-center gap-2'>
          <Image alt="test" width={80} height={80} src={Test_icon_1}/>
        <h1 className='text-xl'>30 MIN TEST</h1>
        </div>
        <div className='flex flex-row justify-start items-center gap-2'>
          <Image alt="test" width={80} height={80} src={Test_icon_2}/>
        <h1 className='text-xl'>
          Literature, Grammer
          <br/>
          {`(Begginer, Intermediate, Advanced)`}</h1>
        </div>
        </div>
      </div>
    </div>
      </div>
      <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Instructions!</h3>
              <p className="py-4">
                1. Select the correct answer for each question. <br />
                2. click next to move to the next question. <br />
                3. click submit to see your score. <br />
                4. click restart to restart the test. <br />
                4. Do not press back button otherwise your test will be
                terminated. <br />
                5. The text will be 30 minutes, so make sure you have enough
                time. <br />
              </p>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
    

    </div>
  )
}

export default Test