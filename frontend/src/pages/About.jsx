import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-[#707070]'>
        <p>ABOUT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Welcome to Charusat Hospital, your dedicated partner in providing personalized healthcare. At Charusat Hospital, we understand the importance of accessible and timely healthcare, which is why we've created a platform that simplifies the process of booking appointments with trusted medical professionals.</p>
          <p>At Charusat Hospital, we are passionate about delivering excellence in healthcare services. We are committed to continually enhancing our platform with the latest technology to ensure a smooth and seamless experience for every user. Whether you're booking a check-up or managing ongoing care, Charusat Hospital is here to guide you on your health journey.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>Our vision at Charusat Hospital is to revolutionize healthcare access, providing a convenient and reliable solution for connecting patients with top healthcare providers. We aim to make healthcare more accessible, ensuring that every patient receives the care they deserve, when they need it most.</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-emerald-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>EFFICIENCY:</b>
          <p>Quick and easy appointment scheduling, designed to fit into your busy schedule.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-emerald-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>CONVENIENCE: </b>
          <p>Access a network of experienced and trusted healthcare professionals in your local area.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-emerald-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>PERSONALIZATION:</b>
          <p>Receive personalized health recommendations and appointment reminders to keep you on track.</p>
        </div>
      </div>

    </div>
  )
}

export default About
