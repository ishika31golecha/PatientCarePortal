import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Add missing axios import

// Define LoadingSpinner component
const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const Homepage = () => {
  const navigate = useNavigate();
  const [regNumber, setRegNumber] = useState('');
  // Add missing state variables
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: '', message: '' });

  const handleInputChange = (e) => {
    setRegNumber(e.target.value);
  };

  // Add missing clearAlert function
  const clearAlert = () => {
    setAlertInfo({ type: '', message: '' });
  };

  const fetchPatient = async () => {
    if (!regNumber.trim()) {
      setAlertInfo({ type: 'error', message: 'Please enter a registration number' });
      return;
    }

    setLoading(true);
    clearAlert();

    try {
      // Get API URL from environment variable with fallback
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Fetch patient data
      const response = await axios.get(`${apiUrl}/patients/${regNumber}`);
      
      // Store patient data in localStorage for access on the next page
      localStorage.setItem('patientData', JSON.stringify(response.data));
      
      // Redirect to the patient display page
      navigate(`/patient/${regNumber}`);
    } catch (err) {
      console.error('Error fetching patient:', err);
      setAlertInfo({ 
        type: 'error', 
        message: err.response?.data?.message || 'Patient not found. Please check the registration number.'
      });
      setLoading(false);
    }
  };

  // Handle Enter key press in the input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchPatient(); // Fixed function name
    }
  };

  return (
    <section>
      <div className="w-full min-h-screen bg-[#DDF7FE]">
        <nav className="bg-white mt-5">
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex shrink-0 items-center space-x-3">
                  <img className="h-16 w-16" src="/imgs/logo.PNG" alt="PublicCarePortal"/>
                  <h1 className="text-2xl font-sans">Public Care <br/>Portal </h1>
                </div>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center space-x-4 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button 
                  type="button" 
                  onClick={() => navigate('/camera-feed')} 
                  className="relative rounded-full bg-[#72C6EB] p-1 text-black hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">View notifications</span>
                  <svg className="size-10" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-12">
          {/* Alert message */}
          {alertInfo.message && (
            <div className={`mb-4 p-4 rounded ${alertInfo.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {alertInfo.message}
            </div>
          )}
          
          <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 justify-center">
            {/* Registration Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-1/2 lg:w-2/5 flex flex-col">
              <div className="bg-[#72C6EB] bg-opacity-50 p-6 flex-1 flex flex-col items-center">
                <img src="/imgs/patient_reg.jpg" className="h-48 w-auto object-cover mb-6" alt="Patient Registration"/>
                <h2 className="text-xl font-semibold mb-4">New Patient Registration</h2>
                <p className="text-gray-600 mb-6 text-center">Register new patients into the system with their personal and medical details</p>
                <button 
                  onClick={() => navigate('/new-reg')} 
                  className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 ease-in-out flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New Registration
                </button>
              </div>
            </div>

            {/* Patient Display Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-1/2 lg:w-2/5 flex flex-col">
              <div className="bg-[#8DC642] bg-opacity-50 p-6 flex-1 flex flex-col items-center">
                <img src="/imgs/doc_treating_patient.jpg" className="h-48 w-auto object-cover mb-6" alt="Patient Information"/>
                <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
                <p className="text-gray-600 mb-6 text-center">View and update existing patient records and medical information</p>
                <div className="mt-auto w-full">
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <input 
                      type="text" 
                      placeholder="Enter Registration Number" 
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={regNumber}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                    />
                    <button 
                      onClick={fetchPatient}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 ease-in-out whitespace-nowrap flex items-center"
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner />
                          <span>Searching...</span>
                        </>
                      ) : "Fetch Patient"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Homepage;