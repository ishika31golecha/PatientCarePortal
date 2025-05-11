import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RegistrationSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { regNumber } = location.state || {};

  return (
    <div className="min-h-screen bg-[#DDF7FE] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="mb-6">
          <div className="bg-green-100 h-24 w-24 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h1>
        <p className="text-gray-600 mb-6">The patient has been successfully registered in our system.</p>
        
        {regNumber && (
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <p className="text-gray-600 mb-1">Registration Number:</p>
            <p className="text-2xl font-bold text-blue-600">{regNumber}</p>
            <p className="text-sm text-gray-500 mt-2">Please keep this number for future reference</p>
          </div>
        )}
        
        <div className="flex flex-col space-y-3">
          <button 
            onClick={() => navigate('/new-reg')} 
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
          >
            Register Another Patient
          </button>
          
          <button 
            onClick={() => navigate('/')} 
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded w-full"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;