import React, { useState } from 'react'

import { APP_FEATURES } from '../utils/data'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {

  const navigate = useNavigate()
  const [openAuthModel, setOpenAuthModal] = useState(false)
  const [currentPage, setCurrentPage] = useState('login')
  
  const handleCTA = () => {}
  
  return (
    <div className='w-full min-h-full bg-[#fffcef]'>
      <div className='w-[500px] h-[500px] bg-amber-200/20 blur-[65px] absolute top-0 left-0' />

      <div className='container mx-auto px-4 pt-6 pb-[200px] relative z-10'>
        {/* header*/}

        <header className='flex justify-between items-center mb-16'>
          <div className='text-xl font-bold text-[#000]'>
            Interview Prep AI
          </div>
          <button
            className='bg-linear-to-r from-[#ff9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white border border-white transition-colors cursor-pointer'
            onClick={() => setOpenAuthModal(true)}
          >
            Login / sign up
          </button>
        </header>

      {/* Hero content */}

      <div className='flex flex-col md:flex-row'>
        <div className='w-full md:w-1/2 pr-4 mb-8 md:mb-0'>
          <div className='flex items-center justify-left mb-2'>
            <div className='flex items-center gap-2 text-[13px] text-amber-500 font-semibold bg-amber-100 px-3 py-1 rounded-full border border-amber-200'>
              Ai powered
            </div>
          </div>

          <h1 className='text-5xl text-black font-medium mb-6 leaeding-tight'>
            Ai interview with <br />
            <span className=''>
              AI-powered 
            </span> {" "}
              Learning
          </h1>
        </div>

        <div className=''>
          <p className=''>
            Interview Prep AI is a platform that helps you prepare for interviews by providing you with a simulated interview experience.
          </p>

          <button
            className=''
            onClick={handleCTA}>
              Get Started
            </button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default LandingPage