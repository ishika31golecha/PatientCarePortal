import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MedicalInformationForm = () => {
  const { regNumber } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState('medicalHistory');
  const [patientName, setPatientName] = useState('');

  const [formData, setFormData] = useState({
    // Medical History
    medicalConditions: '',
    pastSurgeries: '',
    allergies: {
      medication: '',
      food: '',
      environmental: ''
    },
    ongoingMedications: '',
    familyMedicalHistory: '',

    // Admission Details
    admissionDateTime: '',
    department: '',
    referredBy: '',
    admittingDoctor: '',
    chiefComplaint: '',
    initialDiagnosis: '',

    // Vitals and Initial Observations
    vitals: {
      bloodPressure: '',
      heartRate: '',
      respiratoryRate: '',
      temperature: '',
      oxygenSaturation: '',
      weight: '',
      height: ''
    },

    // Diagnostic Tests
    diagnosticTests: {
      bloodTests: '',
      imaging: '',
      ecg: '',
      otherTests: ''
    },

    // Treatment Plan
    treatmentPlan: {
      medications: '',
      ivFluids: '',
      surgicalPlan: '',
      dietaryRestrictions: '',
      supportServices: ''
    },

    // Doctor/Nurse Notes
    notes: {
      progressNotes: '',
      clinicalObservations: '',
      nursingAssessments: '',
      handoverNotes: ''
    },

    // Consent and Legal Documents
    consent: {
      surgeryConsent: false,
      anesthesiaConsent: false,
      treatmentConsent: false,
      idProofSubmitted: false,
      insuranceDetails: ''
    },

    // Hospital Infrastructure
    infrastructure: {
      bedNumber: '',
      roomType: '',
      assignedNurse: ''
    },

    // Discharge Details
    discharge: {
      dischargeSummary: '',
      finalDiagnosis: '',
      dischargeMedications: '',
      followUpInstructions: '',
      referralDetails: ''
    }
  });

  useEffect(() => {
    fetchPatientBasicInfo();
    fetchExistingMedicalData();
  }, [regNumber]);

  const fetchPatientBasicInfo = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/patients/${regNumber}`);
      const patientData = response.data.patient || response.data;
      const fullName = [patientData.firstName, patientData.middleName, patientData.lastName]
        .filter(Boolean)
        .join(' ');
      setPatientName(fullName);
    } catch (err) {
      console.error('Error fetching patient basic info:', err);
    }
  };

 const fetchExistingMedicalData = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const response = await axios.get(`${apiUrl}/patients/${regNumber}/medical`);
    
    // Handle the response structure properly
    if (response.data && response.data.success && response.data.data) {
      const medicalData = response.data.data;
      
      setFormData(prevData => ({
        ...prevData,
        ...medicalData,
        // Ensure all nested objects are properly merged
        allergies: {
          ...prevData.allergies,
          ...(medicalData.allergies || {})
        },
        vitals: {
          ...prevData.vitals,
          ...(medicalData.vitals || {})
        },
        diagnosticTests: {
          ...prevData.diagnosticTests,
          ...(medicalData.diagnosticTests || {})
        },
        treatmentPlan: {
          ...prevData.treatmentPlan,
          ...(medicalData.treatmentPlan || {})
        },
        notes: {
          ...prevData.notes,
          ...(medicalData.notes || {})
        },
        consent: {
          ...prevData.consent,
          ...(medicalData.consent || {})
        },
        infrastructure: {
          ...prevData.infrastructure,
          ...(medicalData.infrastructure || {})
        },
        discharge: {
          ...prevData.discharge,
          ...(medicalData.discharge || {})
        }
      }));
    }
  } catch (err) {
    // If no existing data, that's fine - we'll start with empty form
    console.log('No existing medical data found or error fetching:', err.message);
  }
};

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleCheckboxChange = (section, field, checked) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: checked
      }
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');

  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const response = await axios.post(`${apiUrl}/patients/${regNumber}/medical`, formData);
    
    // Handle successful response
    if (response.data && response.data.success) {
      setSuccess(response.data.message || 'Medical information saved successfully!');
      
      // Auto redirect after 2 seconds
      setTimeout(() => {
        navigate(`/patient/${regNumber}`);
      }, 2000);
    } else {
      setSuccess('Medical information saved successfully!');
      setTimeout(() => {
        navigate(`/patient/${regNumber}`);
      }, 2000);
    }
  } catch (err) {
    console.error('Error saving medical information:', err);
    setError(err.response?.data?.message || 'Failed to save medical information. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const sections = [
    { id: 'medicalHistory', title: 'Medical History', icon: '📋' },
    { id: 'admission', title: 'Admission Details', icon: '🏥' },
    { id: 'vitals', title: 'Vitals & Observations', icon: '📊' },
    { id: 'diagnostics', title: 'Diagnostic Tests', icon: '🔬' },
    { id: 'treatment', title: 'Treatment Plan', icon: '💊' },
    { id: 'notes', title: 'Doctor/Nurse Notes', icon: '📝' },
    { id: 'consent', title: 'Consent & Legal', icon: '📋' },
    { id: 'infrastructure', title: 'Hospital Info', icon: '🏢' },
    { id: 'discharge', title: 'Discharge Details', icon: '🚪' }
  ];

  const renderMedicalHistory = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Medical History</h3>
      
      <div>
        <label className="block text-gray-700 font-medium mb-2">Known Medical Conditions</label>
        <textarea
          value={formData.medicalConditions}
          onChange={(e) => handleInputChange(null, 'medicalConditions', e.target.value)}
          placeholder="e.g., diabetes, hypertension, heart disease..."
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Past Surgeries or Hospitalizations</label>
        <textarea
          value={formData.pastSurgeries}
          onChange={(e) => handleInputChange(null, 'pastSurgeries', e.target.value)}
          placeholder="List previous surgeries, dates, and hospitals..."
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <h4 className="font-medium text-gray-700 mb-3">Allergies</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1">Medication Allergies</label>
            <textarea
              value={formData.allergies.medication}
              onChange={(e) => handleInputChange('allergies', 'medication', e.target.value)}
              placeholder="List medication allergies..."
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Food Allergies</label>
            <textarea
              value={formData.allergies.food}
              onChange={(e) => handleInputChange('allergies', 'food', e.target.value)}
              placeholder="List food allergies..."
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Environmental Allergies</label>
            <textarea
              value={formData.allergies.environmental}
              onChange={(e) => handleInputChange('allergies', 'environmental', e.target.value)}
              placeholder="List environmental allergies..."
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Ongoing Medications</label>
        <textarea
          value={formData.ongoingMedications}
          onChange={(e) => handleInputChange(null, 'ongoingMedications', e.target.value)}
          placeholder="List current medications with dosages..."
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Family Medical History</label>
        <textarea
          value={formData.familyMedicalHistory}
          onChange={(e) => handleInputChange(null, 'familyMedicalHistory', e.target.value)}
          placeholder="Relevant family medical history..."
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderAdmissionDetails = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Admission Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Date and Time of Admission</label>
          <input
            type="datetime-local"
            value={formData.admissionDateTime}
            onChange={(e) => handleInputChange(null, 'admissionDateTime', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Department/Ward</label>
          <select
            value={formData.department}
            onChange={(e) => handleInputChange(null, 'department', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Department</option>
            <option value="General">General</option>
            <option value="ICU">ICU</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Emergency">Emergency</option>
            <option value="Surgery">Surgery</option>
            <option value="Maternity">Maternity</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Referred By</label>
          <input
            type="text"
            value={formData.referredBy}
            onChange={(e) => handleInputChange(null, 'referredBy', e.target.value)}
            placeholder="Doctor/Hospital name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Admitting Doctor</label>
          <input
            type="text"
            value={formData.admittingDoctor}
            onChange={(e) => handleInputChange(null, 'admittingDoctor', e.target.value)}
            placeholder="Dr. Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Chief Complaint</label>
        <textarea
          value={formData.chiefComplaint}
          onChange={(e) => handleInputChange(null, 'chiefComplaint', e.target.value)}
          placeholder="Primary reason for admission..."
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Initial Diagnosis</label>
        <textarea
          value={formData.initialDiagnosis}
          onChange={(e) => handleInputChange(null, 'initialDiagnosis', e.target.value)}
          placeholder="Preliminary diagnosis..."
          rows="2"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderVitals = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Vitals & Initial Observations</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Blood Pressure</label>
          <input
            type="text"
            value={formData.vitals.bloodPressure}
            onChange={(e) => handleInputChange('vitals', 'bloodPressure', e.target.value)}
            placeholder="120/80 mmHg"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Heart Rate</label>
          <input
            type="text"
            value={formData.vitals.heartRate}
            onChange={(e) => handleInputChange('vitals', 'heartRate', e.target.value)}
            placeholder="72 bpm"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Respiratory Rate</label>
          <input
            type="text"
            value={formData.vitals.respiratoryRate}
            onChange={(e) => handleInputChange('vitals', 'respiratoryRate', e.target.value)}
            placeholder="16 breaths/min"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Temperature</label>
          <input
            type="text"
            value={formData.vitals.temperature}
            onChange={(e) => handleInputChange('vitals', 'temperature', e.target.value)}
            placeholder="98.6°F / 37°C"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Oxygen Saturation (SpO₂)</label>
          <input
            type="text"
            value={formData.vitals.oxygenSaturation}
            onChange={(e) => handleInputChange('vitals', 'oxygenSaturation', e.target.value)}
            placeholder="98%"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Weight (kg)</label>
          <input
            type="number"
            value={formData.vitals.weight}
            onChange={(e) => handleInputChange('vitals', 'weight', e.target.value)}
            placeholder="70"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Height (cm)</label>
          <input
            type="number"
            value={formData.vitals.height}
            onChange={(e) => handleInputChange('vitals', 'height', e.target.value)}
            placeholder="170"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderDiagnostics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Diagnostic Tests Ordered</h3>
      
      <div>
        <label className="block text-gray-700 font-medium mb-2">Blood Tests</label>
        <textarea
          value={formData.diagnosticTests.bloodTests}
          onChange={(e) => handleInputChange('diagnosticTests', 'bloodTests', e.target.value)}
          placeholder="CBC, Blood Sugar, Liver Function Tests, etc."
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Imaging Studies</label>
        <textarea
          value={formData.diagnosticTests.imaging}
          onChange={(e) => handleInputChange('diagnosticTests', 'imaging', e.target.value)}
          placeholder="X-ray, CT scan, MRI, Ultrasound, etc."
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">ECG/EEG and Other Tests</label>
        <textarea
          value={formData.diagnosticTests.ecg}
          onChange={(e) => handleInputChange('diagnosticTests', 'ecg', e.target.value)}
          placeholder="ECG, EEG, Stress Test, etc."
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Other Specialized Investigations</label>
        <textarea
          value={formData.diagnosticTests.otherTests}
          onChange={(e) => handleInputChange('diagnosticTests', 'otherTests', e.target.value)}
          placeholder="Endoscopy, Biopsy, Pulmonary Function Tests, etc."
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderTreatment = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Treatment Plan</h3>
      
      <div>
        <label className="block text-gray-700 font-medium mb-2">Medications Prescribed</label>
        <textarea
          value={formData.treatmentPlan.medications}
          onChange={(e) => handleInputChange('treatmentPlan', 'medications', e.target.value)}
          placeholder="Medicine name, dosage, frequency, duration..."
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">IV Fluids and Injections</label>
        <textarea
          value={formData.treatmentPlan.ivFluids}
          onChange={(e) => handleInputChange('treatmentPlan', 'ivFluids', e.target.value)}
          placeholder="Type of IV fluids, rate, injections..."
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Surgical Plan (if any)</label>
        <textarea
          value={formData.treatmentPlan.surgicalPlan}
          onChange={(e) => handleInputChange('treatmentPlan', 'surgicalPlan', e.target.value)}
          placeholder="Planned surgeries, procedures, dates..."
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Dietary Restrictions</label>
        <textarea
          value={formData.treatmentPlan.dietaryRestrictions}
          onChange={(e) => handleInputChange('treatmentPlan', 'dietaryRestrictions', e.target.value)}
          placeholder="Diet plan, restrictions, special requirements..."
          rows="2"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Physiotherapy or Other Support Services</label>
        <textarea
          value={formData.treatmentPlan.supportServices}
          onChange={(e) => handleInputChange('treatmentPlan', 'supportServices', e.target.value)}
          placeholder="Physiotherapy, occupational therapy, counseling..."
          rows="2"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderNotes = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Doctor/Nurse Notes</h3>
      
      <div>
        <label className="block text-gray-700 font-medium mb-2">Daily Progress Notes</label>
        <textarea
          value={formData.notes.progressNotes}
          onChange={(e) => handleInputChange('notes', 'progressNotes', e.target.value)}
          placeholder="Daily progress, improvements, concerns..."
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Clinical Observations</label>
        <textarea
          value={formData.notes.clinicalObservations}
          onChange={(e) => handleInputChange('notes', 'clinicalObservations', e.target.value)}
          placeholder="Clinical findings, symptoms, patient response..."
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Nursing Assessments</label>
        <textarea
          value={formData.notes.nursingAssessments}
          onChange={(e) => handleInputChange('notes', 'nursingAssessments', e.target.value)}
          placeholder="Nursing observations, patient care notes..."
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Shift Handover Notes</label>
        <textarea
          value={formData.notes.handoverNotes}
          onChange={(e) => handleInputChange('notes', 'handoverNotes', e.target.value)}
          placeholder="Shift changes, important information for next shift..."
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderConsent = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Consent & Legal Documents</h3>
      
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Consent Forms</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.consent.surgeryConsent}
              onChange={(e) => handleCheckboxChange('consent', 'surgeryConsent', e.target.checked)}
              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-gray-700">Surgery Consent Form</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.consent.anesthesiaConsent}
              onChange={(e) => handleCheckboxChange('consent', 'anesthesiaConsent', e.target.checked)}
              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-gray-700">Anesthesia Consent Form</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.consent.treatmentConsent}
              onChange={(e) => handleCheckboxChange('consent', 'treatmentConsent', e.target.checked)}
              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-gray-700">General Treatment Consent Form</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.consent.idProofSubmitted}
              onChange={(e) => handleCheckboxChange('consent', 'idProofSubmitted', e.target.checked)}
              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-gray-700">ID Proof Documents Submitted</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Insurance Details</label>
        <textarea
          value={formData.consent.insuranceDetails}
          onChange={(e) => handleInputChange('consent', 'insuranceDetails', e.target.value)}
          placeholder="Insurance company, policy number, coverage details..."
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderInfrastructure = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Hospital Infrastructure</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Bed Number</label>
          <input
            type="text"
            value={formData.infrastructure.bedNumber}
            onChange={(e) => handleInputChange('infrastructure', 'bedNumber', e.target.value)}
            placeholder="e.g., A-101"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Room Type</label>
          <select
            value={formData.infrastructure.roomType}
            onChange={(e) => handleInputChange('infrastructure', 'roomType', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Room Type</option>
            <option value="General Ward">General Ward</option>
            <option value="Private Room">Private Room</option>
            <option value="Semi-Private">Semi-Private</option>
            <option value="ICU">ICU</option>
            <option value="NICU">NICU</option>
            <option value="CCU">CCU</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Assigned Nurse/Attendant</label>
          <input
            type="text"
            value={formData.infrastructure.assignedNurse}
            onChange={(e) => handleInputChange('infrastructure', 'assignedNurse', e.target.value)}
            placeholder="Nurse name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderDischarge = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Discharge Details</h3>
      
      <div>
        <label className="block text-gray-700 font-medium mb-2">Discharge Summary</label>
        <textarea
          value={formData.discharge.dischargeSummary}
          onChange={(e) => handleInputChange('discharge', 'dischargeSummary', e.target.value)}
          placeholder="Summary of hospitalization, treatment provided..."
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Final Diagnosis</label>
        <textarea
          value={formData.discharge.finalDiagnosis}
          onChange={(e) => handleInputChange('discharge', 'finalDiagnosis', e.target.value)}
          placeholder="Final confirmed diagnosis..."
          rows="2"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Medications on Discharge</label>
        <textarea
          value={formData.discharge.dischargeMedications}
          onChange={(e) => handleInputChange('discharge', 'dischargeMedications', e.target.value)}
          placeholder="Medications to continue at home..."
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Follow-up Instructions</label>
        <textarea
          value={formData.discharge.followUpInstructions}
          onChange={(e) => handleInputChange('discharge', 'followUpInstructions', e.target.value)}
          placeholder="Follow-up appointments, care instructions..."
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Referral Details</label>
        <textarea
          value={formData.discharge.referralDetails}
          onChange={(e) => handleInputChange('discharge', 'referralDetails', e.target.value)}
          placeholder="Referrals to specialists, other hospitals..."
          rows="2"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'medicalHistory': return renderMedicalHistory();
      case 'admission': return renderAdmissionDetails();
      case 'vitals': return renderVitals();
      case 'diagnostics': return renderDiagnostics();
      case 'treatment': return renderTreatment();
      case 'notes': return renderNotes();
      case 'consent': return renderConsent();
      case 'infrastructure': return renderInfrastructure();
      case 'discharge': return renderDischarge();
      default: return renderMedicalHistory();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Medical Information Form</h1>
              <p className="text-gray-600">Patient: {patientName} | Reg No: {regNumber}</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button 
                onClick={() => navigate(`/patient/${regNumber}`)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
              >
                Back to Patient
              </button>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
            <p className="font-medium">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-4 sticky top-6">
              <h3 className="font-semibold text-gray-800 mb-4">Sections</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Form Content */}
          <div className="lg:w-3/4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
              {renderActiveSection()}

              {/* Form Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(`/patient/${regNumber}`)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md transition duration-300 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 ease-in-out disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Medical Information'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalInformationForm;