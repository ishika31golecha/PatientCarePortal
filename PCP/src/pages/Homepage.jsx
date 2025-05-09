import React from 'react'
import {useNavigate} from 'react-router-dom'

const Homepage = () => {
    const navigate = useNavigate();
  return (
    <>
    <section>
    <div className="w-full h-screen overflow-hidden bg-white/70">
        <nav className="bg-white mt-11">

            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex shrink-0 items-center space-x-3">
                    <img className="h-20 w-auto" src="/imgs/logo.PNG" alt="PublicCarePortal"/>
                    <h1 className="text-2xl font-sans">Public Care <br/>Portal </h1>
                  </div>
                </div>

                <div className="absolute inset-y-0 right-0 flex items-center space-x-4 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <button type="button" onClick={() => navigate('/camera-feed')} className="relative rounded-full bg-[#72C6EB] p-1 text-black hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">View notifications</span>
                    <svg className="size-10" fill="none" viewBox="0 0 24 24"  strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path  strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"/>
                    </svg>
                  </button>
                </div>

              </div>
            </div>
        </nav>

        <div className='flex space-x-20 mt-20 justify-center'>
          
        <div className='relative bg-[#72C6EB] bg-opacity-50 p-4 h-96 w-1/3 flex flex-col justify-start items-center text-center'>
          <img src='/imgs/patient_reg.jpg' className='h-48 w-52' alt="Patient Registration"/>
          <h2 className="mt-4 text-lg font-semibold">New Patient Registration</h2>
          <a href='/new-reg' className='rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black hover:text-white aria-current="page" mt-10'>+ New Registration</a>
        </div>

          <div className='relative bg-[#8DC642] bg-opacity-50 p-4 h-96 w-1/3 flex flex-col justify-start items-center text-center'>
            <img src='/imgs/doc_treating_patient.jpg' className='h-48 w-52'/>
            <h2 className="mt-4 text-lg font-semibold">Display and Update Patient Information</h2>
            <div className='flex space-x-5'>
            <input type="text" placeholder="Enter Patient ID" className="mt-10 px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-center"/>
            <a href='' className='rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black hover:text-white aria-current="page" mt-10'>Fetch</a>
            </div>
          </div>

        </div>
        
        </div>
    </section>
    </>
  )
}

export default Homepage
