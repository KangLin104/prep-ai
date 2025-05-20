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
            className=''
            onClick={() => setOpenAuthModal(true)}
          >
            Login / sign up
          </button>
        </header>
      </div>

      {/* Hero content */}

      <div className=''>
        <div className=''>
          <div className=''>
            <div className=''>
              Ai powered
            </div>
          </div>

          <h1 className=''>
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
  )
}

export default LandingPage