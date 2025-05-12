import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientDisplay = () => {
  const { regNumber } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(null);

  useEffect(() => {
    // Try to get data from localStorage first
    const storedData = localStorage.getItem('patientData');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setPatient(parsedData);
        setEditedData(parsedData);
        setLoading(false);
        
        // Clear localStorage after successful retrieval
        localStorage.removeItem('patientData');
      } catch (err) {
        console.error('Error parsing stored patient data:', err);
        fetchPatientData(); // Fallback to fetching from API
      }
    } else {
      fetchPatientData(); // No stored data, fetch from API
    }
  }, [regNumber]);

  const fetchPatientData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/patients/${regNumber}`);
      
      // Handle the nested 'patient' property in the response
      const patientData = response.data.patient || response.data;
      setPatient(patientData);
      setEditedData(patientData);
    } catch (err) {
      console.error('Error fetching patient:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to fetch patient details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveChanges = async () => {
    setLoading(true);
    setError('');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.put(`${apiUrl}/patients/${regNumber}`, editedData);
      
      // Handle the nested 'patient' property in the response
      const updatedPatient = response.data.patient || response.data;
      setPatient(updatedPatient);
      setEditMode(false);
    } catch (err) {
      console.error('Error updating patient:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to update patient details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  const getFullName = (patient) => {
    if (!patient) return '';
    return [patient.firstName, patient.middleName, patient.lastName]
      .filter(Boolean)
      .join(' ');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            <p className="font-medium">{error}</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 ease-in-out"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-blue-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="bg-yellow-100 text-yellow-700 p-4 rounded mb-6">
            <p className="font-medium">No patient data found for registration number: {regNumber}</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 ease-in-out"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Patient Information</h1>
              <p className="text-gray-600">Registration Number: {regNumber}</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button 
                onClick={() => navigate('/')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
              >
                Back to Home
              </button>
              {!editMode ? (
                <button 
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
                >
                  Edit Information
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setEditedData(patient);
                      setEditMode(false);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveChanges}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Patient Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Basic Information */}
          <div className="bg-blue-100 p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                {editMode ? (
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={editedData.firstName || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="middleName"
                      placeholder="Middle Name"
                      value={editedData.middleName || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={editedData.lastName || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <p className="text-gray-800">{getFullName(patient)}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
                {editMode ? (
                  <input
                    type="date"
                    name="dob"
                    value={editedData.dob ? new Date(editedData.dob).toISOString().split('T')[0] : ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">{formatDate(patient.dob)}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Gender</label>
                {editMode ? (
                  <select
                    name="gender"
                    value={editedData.gender || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-800">{patient.gender || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Age</label>
                {editMode ? (
                  <input
                    type="number"
                    name="age"
                    value={editedData.age || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">{patient.age || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                {editMode ? (
                  <input
                    type="tel"
                    name="pContactNo"
                    value={editedData.pContactNo || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">{patient.pContactNo || 'Not provided'}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={editedData.email || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">{patient.email || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-2">Address</label>
              {editMode ? (
                <textarea
                  name="address"
                  value={editedData.address || ''}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              ) : (
                <p className="text-gray-800">{patient.address || 'No address recorded'}</p>
              )}
            </div>
          </div>

          {/* Medical Information */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Medical Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Blood Group</label>
                {editMode ? (
                  <select
                    name="bloodGroup"
                    value={editedData.bloodGroup || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                ) : (
                  <p className="text-gray-800">{patient.bloodGroup || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Height (cm)</label>
                {editMode ? (
                  <input
                    type="number"
                    name="height"
                    value={editedData.height || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">{patient.height || 'Not recorded'}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Weight (kg)</label>
                {editMode ? (
                  <input
                    type="number"
                    name="weight"
                    value={editedData.weight || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">{patient.weight || 'Not recorded'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact Information */}
          <div className="bg-blue-50 p-6">
            <h2 className="text-xl font-semibold mb-4">Emergency Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Contact Name</label>
                {editMode ? (
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      name="eFirstName"
                      placeholder="First Name"
                      value={editedData.eFirstName || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="eMiddleName"
                      placeholder="Middle Name"
                      value={editedData.eMiddleName || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="eLastName"
                      placeholder="Last Name"
                      value={editedData.eLastName || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <p className="text-gray-800">
                    {[patient.eFirstName, patient.eMiddleName, patient.eLastName]
                      .filter(Boolean)
                      .join(' ') || 'Not provided'}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Relationship</label>
                {editMode ? (
                  <input
                    type="text"
                    name="relationship"
                    value={editedData.relationship || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">{patient.relationship || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Contact Number</label>
                {editMode ? (
                  <input
                    type="tel"
                    name="eContactNo"
                    value={editedData.eContactNo || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">{patient.eContactNo || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-2">Address</label>
              {editMode ? (
                <textarea
                  name="eAddress"
                  value={editedData.eAddress || ''}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              ) : (
                <p className="text-gray-800">{patient.eAddress || 'No address recorded'}</p>
              )}
            </div>
          </div>

          {/* Admission Details */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Admission Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Admission Type</label>
                {editMode ? (
                  <select
                    name="admissionType"
                    value={editedData.admissionType || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Planned">Planned</option>
                    <option value="Transfer">Transfer</option>
                  </select>
                ) : (
                  <p className="text-gray-800">{patient.admissionType || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Admission Date</label>
                {editMode ? (
                  <input
                    type="date"
                    name="admissionDate"
                    value={editedData.admissionDate ? new Date(editedData.admissionDate).toISOString().split('T')[0] : ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">{formatDate(patient.admissionDate)}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Department</label>
                {editMode ? (
                  <input
                    type="text"
                    name="department"
                    value={editedData.department || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">{patient.department || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Ward Type</label>
                {editMode ? (
                  <input
                    type="text"
                    name="wardType"
                    value={editedData.wardType || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-800">{patient.wardType || 'Not specified'}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-2">Primary Complaint</label>
              {editMode ? (
                <textarea
                  name="primaryComplaint"
                  value={editedData.primaryComplaint || ''}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              ) : (
                <p className="text-gray-800">{patient.primaryComplaint || 'None recorded'}</p>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-2">Additional Notes</label>
              {editMode ? (
                <textarea
                  name="additionalNotes"
                  value={editedData.additionalNotes || ''}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              ) : (
                <p className="text-gray-800">{patient.additionalNotes || 'No additional notes'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDisplay;