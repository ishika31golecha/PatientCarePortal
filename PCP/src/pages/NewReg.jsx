import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'; 

const NewReg = () => {
  const navigate = useNavigate();
  const [formSection, setFormSection] = useState('patient'); // 'patient', 'emergency', or 'admission'
  const [formData, setFormData] = useState({
    // Patient Info
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    age: '',
    dob: '',
    pContactNo: '',
    address: '',
    email: '',
    bloodGroup: '',
    height: '',
    weight: '',
    // Emergency Contact
    eFirstName: '',
    eMiddleName: '',
    eLastName: '',
    eContactNo: '',
    relationship: '',
    eAddress: '',
    // Admission Details
    admissionType: '',
    admissionDate: '',
    department: '',
    wardType: '',
    primaryComplaint: '',
    additionalNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [regNumber, setRegNumber] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handlePrevious = (e) => {
    e.preventDefault();
    if (formSection === 'emergency') {
      setFormSection('patient');
    } else if (formSection === 'admission') {
      setFormSection('emergency');
    }
  };
  
  const handleNext = (e) => {
    e.preventDefault();
    if (formSection === 'patient') {
      setFormSection('emergency');
    } else if (formSection === 'emergency') {
      setFormSection('admission');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Get API URL from environment variable
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Send form data to backend
      const response = await axios.post(`${apiUrl}/patients/register`, formData);
      
      // Set success message and registration number
      setSuccess('Patient registered successfully!');
      setRegNumber(response.data.regNumber);
      
      console.log('Registration successful:', response.data);
      
      // You might want to navigate to a success page or stay on the same page
      setTimeout(() => {
        navigate('/registration-success', { state: { regNumber: response.data.regNumber } });
      }, 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Error registering patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section>
        <div className='bg-[#DDF7FE] min-h-screen'>
          <nav className="bg-white mt-5">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex shrink-0 items-center">
                    <img className="h-16 w-16" src="/imgs/logo.PNG" alt="PublicCarePortal"/>
                    <h1 className="text-2xl font-sans">Public Care <br/>Portal </h1>
                  </div>
                </div>

                <div className='flex-1 flex justify-center items-center'>
                  <h1 className="text-3xl font-sans font-bold">
                    {formSection === 'patient' 
                      ? 'Patient Information' 
                      : formSection === 'emergency' 
                        ? 'Emergency Contact' 
                        : 'Admission Details'}
                  </h1>
                </div>

                <div className="absolute inset-y-0 right-0 flex items-center space-x-4 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <button type="button" onClick={() => navigate('/camera-feed')} className="relative rounded-full bg-[#72C6EB] p-1 text-black hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
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

          <div className='flex justify-center items-center w-full px-4 py-8'>
            <form className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
              
              {/* Progress indicator */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formSection === 'patient' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>1</div>
                  <div className="h-1 w-16 bg-gray-300">
                    <div className={`h-full bg-blue-500`} 
                         style={{width: formSection === 'patient' ? '0%' : formSection === 'emergency' ? '100%' : '100%'}}></div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formSection === 'emergency' ? 'bg-blue-500 text-white' : formSection === 'admission' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>2</div>
                  <div className="h-1 w-16 bg-gray-300">
                    <div className={`h-full bg-blue-500`} 
                         style={{width: formSection === 'admission' ? '100%' : '0%'}}></div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formSection === 'admission' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>3</div>
                </div>
              </div>

              {/* Success message */}
              {success && regNumber && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Success! </strong>
                  <span className="block sm:inline">{success}</span>
                  <p className="mt-2 font-bold">Registration Number: {regNumber}</p>
                  <p className="text-sm mt-1">Please keep this number for future reference.</p>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Error! </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              {formSection === 'patient' && (
                <div className="patient-info">
                  <h2 className="text-2xl font-bold mb-6 text-center">Patient Information</h2>
                  
                  <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        className="w-full p-2 border rounded-md"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        name="middleName"
                        placeholder="Middle Name"
                        className="w-full p-2 border rounded-md"
                        value={formData.middleName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        className="w-full p-2 border rounded-md"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
                    <div className='flex-1'>
                      <select 
                        name="gender"
                        className="w-full p-2 border rounded-md text-gray-500" 
                        required
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Gender</option>
                        <option value="male" className="text-black">Male</option>
                        <option value="female" className="text-black">Female</option>
                        <option value="other" className="text-black">Other</option>
                      </select>
                    </div>

                    <div className='flex-1'>
                      <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        className="w-full p-2 border rounded-md"
                        required
                        value={formData.age}
                        onChange={handleChange}
                      />
                    </div>

                    <div className='flex-1'>
                      <input
                        type="date"
                        name="dob"
                        placeholder="Date Of Birth"
                        className="w-full p-2 border rounded-md"
                        required
                        value={formData.dob}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <input
                    type="tel"
                    name="pContactNo"
                    placeholder="Patient's Contact No."
                    className="w-full p-2 border rounded-md mb-4"
                    required
                    value={formData.pContactNo}
                    onChange={handleChange}
                  />

                  <input
                    type='text'
                    name="address"
                    placeholder='Address'
                    className='w-full p-2 border rounded-md mb-4'
                    required
                    value={formData.address}
                    onChange={handleChange}
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded-md mb-4"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />

                  <div className="flex flex-col md:flex-row gap-4 w-full mb-6">
                    <div className="flex-1">
                      <select 
                        name="bloodGroup"
                        className="w-full p-2 border rounded-md text-gray-500" 
                        required
                        value={formData.bloodGroup}
                        onChange={handleChange}
                      >
                        <option value="">Blood Group</option>
                        <option value="A+" className="text-black">A+</option>
                        <option value="A-" className="text-black">A-</option>
                        <option value="B+" className="text-black">B+</option>
                        <option value="B-" className="text-black">B-</option>
                        <option value="AB+" className="text-black">AB+</option>
                        <option value="AB-" className="text-black">AB-</option>
                        <option value="O+" className="text-black">O+</option>
                        <option value="O-" className="text-black">O-</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <input
                        type="number"
                        name="height"
                        placeholder="Height (cm)"
                        className="w-full p-2 border rounded-md"
                        value={formData.height}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex-1">
                      <input
                        type="number"
                        name="weight"
                        placeholder="Weight (kg)"
                        className="w-full p-2 border rounded-md"
                        required
                        value={formData.weight}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      type="button" 
                      onClick={handleNext}
                      className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
                    >
                      Next
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {formSection === 'emergency' && (
                <div className="emergency-contact">
                  <h2 className="text-2xl font-bold mb-6 text-center">Emergency Contact Information</h2>
                  
                  <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        name="eFirstName"
                        placeholder="First Name"
                        className="w-full p-2 border rounded-md"
                        required
                        value={formData.eFirstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        name="eMiddleName"
                        placeholder="Middle Name"
                        className="w-full p-2 border rounded-md"
                        value={formData.eMiddleName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        name="eLastName"
                        placeholder="Last Name"
                        className="w-full p-2 border rounded-md"
                        required
                        value={formData.eLastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
                    <div className="flex-1">
                      <input
                        type="tel"
                        name="eContactNo"
                        placeholder="Emergency Contact No."
                        className="w-full p-2 border rounded-md"
                        required
                        value={formData.eContactNo}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex-1">
                      <select 
                        name="relationship"
                        className="w-full p-2 border rounded-md text-gray-500" 
                        required
                        value={formData.relationship}
                        onChange={handleChange}
                      >
                        <option value="">Relationship to Patient</option>
                        <option value="spouse" className="text-black">Spouse</option>
                        <option value="parent" className="text-black">Parent</option>
                        <option value="child" className="text-black">Child</option>
                        <option value="sibling" className="text-black">Sibling</option>
                        <option value="friend" className="text-black">Friend</option>
                        <option value="other" className="text-black">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <input
                    type='text'
                    name="eAddress"
                    placeholder='Address'
                    className='w-full p-2 border rounded-md mb-6'
                    value={formData.eAddress}
                    onChange={handleChange}
                  />

                  <div className="flex justify-between">
                    <button 
                      type="button" 
                      onClick={handlePrevious}
                      className="flex items-center bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Previous
                    </button>
                    <button 
                      type="button" 
                      onClick={handleNext}
                      className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
                    >
                      Next
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              
              {formSection === 'admission' && (
                <div className="admission-details">
                  <h2 className="text-2xl font-bold mb-6 text-center">Admission Details</h2>
                  
                  <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
                    <div className="flex-1">
                      <select 
                        name="admissionType"
                        className="w-full p-2 border rounded-md text-gray-500" 
                        required
                        value={formData.admissionType}
                        onChange={handleChange}
                      >
                        <option value="">Admission Type</option>
                        <option value="emergency" className="text-black">Emergency</option>
                        <option value="planned" className="text-black">Planned</option>
                        <option value="transfer" className="text-black">Transfer</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <input
                        type="date"
                        name="admissionDate"
                        placeholder="Admission Date"
                        className="w-full p-2 border rounded-md"
                        required
                        value={formData.admissionDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
                    <div className="flex-1">
                      <select 
                        name="department"
                        className="w-full p-2 border rounded-md text-gray-500" 
                        required
                        value={formData.department}
                        onChange={handleChange}
                      >
                        <option value="">Department</option>
                        <option value="cardiology" className="text-black">Cardiology</option>
                        <option value="neurology" className="text-black">Neurology</option>
                        <option value="orthopedics" className="text-black">Orthopedics</option>
                        <option value="pediatrics" className="text-black">Pediatrics</option>
                        <option value="gynecology" className="text-black">Gynecology</option>
                        <option value="oncology" className="text-black">Oncology</option>
                        <option value="general" className="text-black">General Medicine</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <select 
                        name="wardType"
                        className="w-full p-2 border rounded-md text-gray-500" 
                        required
                        value={formData.wardType}
                        onChange={handleChange}
                      >
                        <option value="">Ward Type</option>
                        <option value="general" className="text-black">General Ward</option>
                        <option value="private" className="text-black">Private Room</option>
                        <option value="semi-private" className="text-black">Semi-Private</option>
                        <option value="icu" className="text-black">ICU</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <textarea
                      name="primaryComplaint"
                      placeholder="Primary Complaint/Reason for Admission"
                      className="w-full p-2 border rounded-md"
                      rows="3"
                      required
                      value={formData.primaryComplaint}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  
                  <div className="mb-6">
                    <textarea
                      name="additionalNotes"
                      placeholder="Additional Notes (allergies, current medications, etc.)"
                      className="w-full p-2 border rounded-md"
                      rows="3"
                      value={formData.additionalNotes}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="flex justify-between">
                    <button 
                      type="button" 
                      onClick={handlePrevious}
                      className="flex items-center bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Previous
                    </button>
                    <button 
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md flex items-center"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : "Register"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default NewReg