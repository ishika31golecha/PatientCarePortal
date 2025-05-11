import axios from 'axios';

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions for patient operations
export const patientApi = {
  // Register a new patient
  registerPatient: async (patientData) => {
    try {
      const response = await api.post('/patients/register', patientData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  // Get patient by registration number
  getPatientByRegNumber: async (regNumber) => {
    try {
      const response = await api.get(`/patients/${regNumber}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  // Additional API methods can be added here as needed
  // For example:
  // updatePatient: async (regNumber, patientData) => {...},
  // deletePatient: async (regNumber) => {...},
  // getAllPatients: async (filters) => {...},
};

export default api; 