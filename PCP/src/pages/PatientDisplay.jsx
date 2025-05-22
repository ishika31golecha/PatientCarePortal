import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientDisplay = () => {
  const { regNumber } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [medicalInfo, setMedicalInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    // Try to get data from localStorage first
    const storedData = localStorage.getItem('patientData');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setPatient(parsedData);
        setEditedData(parsedData);
        fetchMedicalInfo(); // Still fetch medical info
        
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
      
      // Fetch medical information
      await fetchMedicalInfo();
    } catch (err) {
      console.error('Error fetching patient:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to fetch patient details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicalInfo = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/patients/${regNumber}/medical`);
      setMedicalInfo(response.data.data);
    } catch (err) {
      // If no medical info exists, that's okay - we'll show empty state
      console.log('No medical information found or error fetching:', err.message);
      setMedicalInfo(null);
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

  // Navigate to medical information form
  const handleMedicalInfoUpdate = () => {
    navigate(`/patient/${regNumber}/medical-form`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleString();
  };

  const getFullName = (patient) => {
    if (!patient) return '';
    return [patient.firstName, patient.middleName, patient.lastName]
      .filter(Boolean)
      .join(' ');
  };

  const renderMedicalHistorySection = () => {
    if (!medicalInfo) return <p className="text-gray-500">No medical history recorded yet.</p>;

    return (
      <div className="space-y-6">
        {medicalInfo.medicalConditions && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Medical Conditions</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded">{medicalInfo.medicalConditions}</p>
          </div>
        )}

        {medicalInfo.pastSurgeries && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Past Surgeries</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded">{medicalInfo.pastSurgeries}</p>
          </div>
        )}

        {(medicalInfo.allergies?.medication || medicalInfo.allergies?.food || medicalInfo.allergies?.environmental) && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Allergies</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {medicalInfo.allergies.medication && (
                <div className="bg-red-50 p-3 rounded">
                  <p className="font-medium text-red-700">Medication</p>
                  <p className="text-red-600">{medicalInfo.allergies.medication}</p>
                </div>
              )}
              {medicalInfo.allergies.food && (
                <div className="bg-orange-50 p-3 rounded">
                  <p className="font-medium text-orange-700">Food</p>
                  <p className="text-orange-600">{medicalInfo.allergies.food}</p>
                </div>
              )}
              {medicalInfo.allergies.environmental && (
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="font-medium text-yellow-700">Environmental</p>
                  <p className="text-yellow-600">{medicalInfo.allergies.environmental}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {medicalInfo.ongoingMedications && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Ongoing Medications</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded">{medicalInfo.ongoingMedications}</p>
          </div>
        )}

        {medicalInfo.familyMedicalHistory && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Family Medical History</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded">{medicalInfo.familyMedicalHistory}</p>
          </div>
        )}
      </div>
    );
  };

  const renderAdmissionSection = () => {
    if (!medicalInfo) return <p className="text-gray-500">No admission details recorded yet.</p>;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medicalInfo.admissionDateTime && (
            <div>
              <h4 className="font-medium text-gray-700">Admission Date & Time</h4>
              <p className="text-gray-600">{formatDateTime(medicalInfo.admissionDateTime)}</p>
            </div>
          )}
          {medicalInfo.department && (
            <div>
              <h4 className="font-medium text-gray-700">Department</h4>
              <p className="text-gray-600">{medicalInfo.department}</p>
            </div>
          )}
          {medicalInfo.referredBy && (
            <div>
              <h4 className="font-medium text-gray-700">Referred By</h4>
              <p className="text-gray-600">{medicalInfo.referredBy}</p>
            </div>
          )}
          {medicalInfo.admittingDoctor && (
            <div>
              <h4 className="font-medium text-gray-700">Admitting Doctor</h4>
              <p className="text-gray-600">{medicalInfo.admittingDoctor}</p>
            </div>
          )}
        </div>

        {medicalInfo.chiefComplaint && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Chief Complaint</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded">{medicalInfo.chiefComplaint}</p>
          </div>
        )}

        {medicalInfo.initialDiagnosis && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Initial Diagnosis</h4>
            <p className="text-gray-600 bg-blue-50 p-3 rounded">{medicalInfo.initialDiagnosis}</p>
          </div>
        )}
      </div>
    );
  };

  const renderVitalsSection = () => {
    if (!medicalInfo?.vitals) return <p className="text-gray-500">No vitals recorded yet.</p>;

    const vitals = medicalInfo.vitals;
    const hasVitals = Object.values(vitals).some(value => value && value.toString().trim() !== '');

    if (!hasVitals) return <p className="text-gray-500">No vitals recorded yet.</p>;

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {vitals.bloodPressure && (
          <div className="bg-red-50 p-3 rounded">
            <p className="font-medium text-red-700">Blood Pressure</p>
            <p className="text-red-600">{vitals.bloodPressure}</p>
          </div>
        )}
        {vitals.heartRate && (
          <div className="bg-pink-50 p-3 rounded">
            <p className="font-medium text-pink-700">Heart Rate</p>
            <p className="text-pink-600">{vitals.heartRate}</p>
          </div>
        )}
        {vitals.respiratoryRate && (
          <div className="bg-blue-50 p-3 rounded">
            <p className="font-medium text-blue-700">Respiratory Rate</p>
            <p className="text-blue-600">{vitals.respiratoryRate}</p>
          </div>
        )}
        {vitals.temperature && (
          <div className="bg-orange-50 p-3 rounded">
            <p className="font-medium text-orange-700">Temperature</p>
            <p className="text-orange-600">{vitals.temperature}</p>
          </div>
        )}
        {vitals.oxygenSaturation && (
          <div className="bg-green-50 p-3 rounded">
            <p className="font-medium text-green-700">Oxygen Saturation</p>
            <p className="text-green-600">{vitals.oxygenSaturation}</p>
          </div>
        )}
        {vitals.weight && (
          <div className="bg-purple-50 p-3 rounded">
            <p className="font-medium text-purple-700">Weight</p>
            <p className="text-purple-600">{vitals.weight} kg</p>
          </div>
        )}
        {vitals.height && (
          <div className="bg-indigo-50 p-3 rounded">
            <p className="font-medium text-indigo-700">Height</p>
            <p className="text-indigo-600">{vitals.height} cm</p>
          </div>
        )}
      </div>
    );
  };

  const renderDiagnosticsSection = () => {
    if (!medicalInfo?.diagnosticTests) return <p className="text-gray-500">No diagnostic tests recorded yet.</p>;

    const diagnostics = medicalInfo.diagnosticTests;
    const hasDiagnostics = Object.values(diagnostics).some(value => value && value.trim() !== '');

    if (!hasDiagnostics) return <p className="text-gray-500">No diagnostic tests recorded yet.</p>;

    return (
      <div className="space-y-4">
        {diagnostics.bloodTests && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Blood Tests</h4>
            <p className="text-gray-600 bg-red-50 p-3 rounded">{diagnostics.bloodTests}</p>
          </div>
        )}
        {diagnostics.imaging && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Imaging Studies</h4>
            <p className="text-gray-600 bg-blue-50 p-3 rounded">{diagnostics.imaging}</p>
          </div>
        )}
        {diagnostics.ecg && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">ECG/EEG and Other Tests</h4>
            <p className="text-gray-600 bg-green-50 p-3 rounded">{diagnostics.ecg}</p>
          </div>
        )}
        {diagnostics.otherTests && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Other Specialized Investigations</h4>
            <p className="text-gray-600 bg-purple-50 p-3 rounded">{diagnostics.otherTests}</p>
          </div>
        )}
      </div>
    );
  };

  const renderTreatmentSection = () => {
    if (!medicalInfo?.treatmentPlan) return <p className="text-gray-500">No treatment plan recorded yet.</p>;

    const treatment = medicalInfo.treatmentPlan;
    const hasTreatment = Object.values(treatment).some(value => value && value.trim() !== '');

    if (!hasTreatment) return <p className="text-gray-500">No treatment plan recorded yet.</p>;

    return (
      <div className="space-y-4">
        {treatment.medications && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Medications</h4>
            <p className="text-gray-600 bg-blue-50 p-3 rounded">{treatment.medications}</p>
          </div>
        )}
        {treatment.ivFluids && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">IV Fluids</h4>
            <p className="text-gray-600 bg-green-50 p-3 rounded">{treatment.ivFluids}</p>
          </div>
        )}
        {treatment.surgicalPlan && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Surgical Plan</h4>
            <p className="text-gray-600 bg-red-50 p-3 rounded">{treatment.surgicalPlan}</p>
          </div>
        )}
        {treatment.dietaryRestrictions && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Dietary Restrictions</h4>
            <p className="text-gray-600 bg-yellow-50 p-3 rounded">{treatment.dietaryRestrictions}</p>
          </div>
        )}
        {treatment.supportServices && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Support Services</h4>
            <p className="text-gray-600 bg-purple-50 p-3 rounded">{treatment.supportServices}</p>
          </div>
        )}
      </div>
    );
  };

  const renderNotesSection = () => {
    if (!medicalInfo?.notes) return <p className="text-gray-500">No notes recorded yet.</p>;

    const notes = medicalInfo.notes;
    const hasNotes = Object.values(notes).some(value => value && value.trim() !== '');

    if (!hasNotes) return <p className="text-gray-500">No notes recorded yet.</p>;

    return (
      <div className="space-y-4">
        {notes.progressNotes && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Daily Progress Notes</h4>
            <p className="text-gray-600 bg-blue-50 p-3 rounded">{notes.progressNotes}</p>
          </div>
        )}
        {notes.clinicalObservations && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Clinical Observations</h4>
            <p className="text-gray-600 bg-green-50 p-3 rounded">{notes.clinicalObservations}</p>
          </div>
        )}
        {notes.nursingAssessments && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Nursing Assessments</h4>
            <p className="text-gray-600 bg-yellow-50 p-3 rounded">{notes.nursingAssessments}</p>
          </div>
        )}
        {notes.handoverNotes && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Shift Handover Notes</h4>
            <p className="text-gray-600 bg-purple-50 p-3 rounded">{notes.handoverNotes}</p>
          </div>
        )}
      </div>
    );
  };

  const renderConsentSection = () => {
    if (!medicalInfo?.consent) return <p className="text-gray-500">No consent information recorded yet.</p>;

    const consent = medicalInfo.consent;
    const hasConsent = Object.values(consent).some(value => 
      (typeof value === 'boolean' && value) || (typeof value === 'string' && value.trim() !== '')
    );

    if (!hasConsent) return <p className="text-gray-500">No consent information recorded yet.</p>;

    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Consent Forms Status</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-3 rounded ${consent.surgeryConsent ? 'bg-green-50' : 'bg-gray-50'}`}>
              <p className={`font-medium ${consent.surgeryConsent ? 'text-green-700' : 'text-gray-700'}`}>
                Surgery Consent: {consent.surgeryConsent ? '✓ Completed' : '✗ Not completed'}
              </p>
            </div>
            <div className={`p-3 rounded ${consent.anesthesiaConsent ? 'bg-green-50' : 'bg-gray-50'}`}>
              <p className={`font-medium ${consent.anesthesiaConsent ? 'text-green-700' : 'text-gray-700'}`}>
                Anesthesia Consent: {consent.anesthesiaConsent ? '✓ Completed' : '✗ Not completed'}
              </p>
            </div>
            <div className={`p-3 rounded ${consent.treatmentConsent ? 'bg-green-50' : 'bg-gray-50'}`}>
              <p className={`font-medium ${consent.treatmentConsent ? 'text-green-700' : 'text-gray-700'}`}>
                Treatment Consent: {consent.treatmentConsent ? '✓ Completed' : '✗ Not completed'}
              </p>
            </div>
            <div className={`p-3 rounded ${consent.idProofSubmitted ? 'bg-green-50' : 'bg-gray-50'}`}>
              <p className={`font-medium ${consent.idProofSubmitted ? 'text-green-700' : 'text-gray-700'}`}>
                ID Proof Submitted: {consent.idProofSubmitted ? '✓ Submitted' : '✗ Not submitted'}
              </p>
            </div>
          </div>
        </div>

        {consent.insuranceDetails && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Insurance Details</h4>
            <p className="text-gray-600 bg-blue-50 p-3 rounded">{consent.insuranceDetails}</p>
          </div>
        )}
      </div>
    );
  };

  const renderInfrastructureSection = () => {
    if (!medicalInfo?.infrastructure) return <p className="text-gray-500">No hospital infrastructure information recorded yet.</p>;

    const infrastructure = medicalInfo.infrastructure;
    const hasInfrastructure = Object.values(infrastructure).some(value => value && value.trim() !== '');

    if (!hasInfrastructure) return <p className="text-gray-500">No hospital infrastructure information recorded yet.</p>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {infrastructure.bedNumber && (
          <div className="bg-blue-50 p-3 rounded">
            <p className="font-medium text-blue-700">Bed Number</p>
            <p className="text-blue-600">{infrastructure.bedNumber}</p>
          </div>
        )}
        {infrastructure.roomType && (
          <div className="bg-green-50 p-3 rounded">
            <p className="font-medium text-green-700">Room Type</p>
            <p className="text-green-600">{infrastructure.roomType}</p>
          </div>
        )}
        {infrastructure.assignedNurse && (
          <div className="bg-purple-50 p-3 rounded">
            <p className="font-medium text-purple-700">Assigned Nurse</p>
            <p className="text-purple-600">{infrastructure.assignedNurse}</p>
          </div>
        )}
      </div>
    );
  };

  const renderDischargeSection = () => {
    if (!medicalInfo?.discharge) return <p className="text-gray-500">No discharge information recorded yet.</p>;

    const discharge = medicalInfo.discharge;
    const hasDischarge = Object.values(discharge).some(value => value && value.trim() !== '');

    if (!hasDischarge) return <p className="text-gray-500">No discharge information recorded yet.</p>;

    return (
      <div className="space-y-4">
        {discharge.dischargeSummary && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Discharge Summary</h4>
            <p className="text-gray-600 bg-blue-50 p-3 rounded">{discharge.dischargeSummary}</p>
          </div>
        )}
        {discharge.finalDiagnosis && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Final Diagnosis</h4>
            <p className="text-gray-600 bg-green-50 p-3 rounded">{discharge.finalDiagnosis}</p>
          </div>
        )}
        {discharge.dischargeMedications && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Medications on Discharge</h4>
            <p className="text-gray-600 bg-yellow-50 p-3 rounded">{discharge.dischargeMedications}</p>
          </div>
        )}
        {discharge.followUpInstructions && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Follow-up Instructions</h4>
            <p className="text-gray-600 bg-purple-50 p-3 rounded">{discharge.followUpInstructions}</p>
          </div>
        )}
        {discharge.referralDetails && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Referral Details</h4>
            <p className="text-gray-600 bg-orange-50 p-3 rounded">{discharge.referralDetails}</p>
          </div>
        )}
      </div>
    );
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Patient Information</h1>
              <p className="text-gray-600">Registration Number: {regNumber}</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <button 
                onClick={() => navigate('/')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
              >
                Back to Home
              </button>
              
              {/* Medical Information Update Button */}
              <button 
                onClick={handleMedicalInfoUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
              >
                {medicalInfo ? 'Update Medical Info' : 'Add Medical Info'}
              </button>

              {!editMode ? (
                <button 
                  onClick={() => setEditMode(true)}
                  className="bg-green-700 hover:bg-green-800 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
                >
                  Edit Basic Info
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

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap space-x-4 md:space-x-8 px-6">
              <button
                onClick={() => setActiveTab('basic')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'basic'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Basic Information
              </button>
              <button
                onClick={() => setActiveTab('medical')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'medical'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Medical History
              </button>
              <button
                onClick={() => setActiveTab('admission')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'admission'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Admission Details
              </button>
              <button
                onClick={() => setActiveTab('vitals')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'vitals'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Vitals
              </button>
              <button
                onClick={() => setActiveTab('diagnostics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'diagnostics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Diagnostics
              </button>
              <button
                onClick={() => setActiveTab('treatment')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'treatment'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Treatment Plan
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'notes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Notes
              </button>
              <button
                onClick={() => setActiveTab('consent')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'consent'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Consent & Legal
              </button>
              <button
                onClick={() => setActiveTab('infrastructure')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'infrastructure'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Hospital Info
              </button>
              <button
                onClick={() => setActiveTab('discharge')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'discharge'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Discharge
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'basic' && (
              <div>
                {/* Basic Information */}
                <div className="bg-blue-100 p-6 rounded-lg mb-6">
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

                {/* Emergency Contact Information */}
                <div className="bg-blue-50 p-6 rounded-lg">
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
              </div>
            )}

            {activeTab === 'medical' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Medical History</h2>
                  {medicalInfo && (
                    <p className="text-sm text-gray-500">
                      Last updated: {formatDateTime(medicalInfo.updatedAt)}
                    </p>
                  )}
                </div>
                {renderMedicalHistorySection()}
              </div>
            )}

            {activeTab === 'admission' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Admission Details</h2>
                  {medicalInfo && (
                    <p className="text-sm text-gray-500">
                      Last updated: {formatDateTime(medicalInfo.updatedAt)}
                    </p>
                  )}
                </div>
                {renderAdmissionSection()}
              </div>
            )}

            {activeTab === 'vitals' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Vitals & Observations</h2>
                  {medicalInfo && (
                    <p className="text-sm text-gray-500">
                      Last updated: {formatDateTime(medicalInfo.updatedAt)}
                    </p>
                  )}
                </div>
                {renderVitalsSection()}
              </div>
            )}

            {activeTab === 'diagnostics' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Diagnostic Tests</h2>
                  {medicalInfo && (
                    <p className="text-sm text-gray-500">
                      Last updated: {formatDateTime(medicalInfo.updatedAt)}
                    </p>
                  )}
                </div>
                {renderDiagnosticsSection()}
              </div>
            )}

            {activeTab === 'treatment' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Treatment Plan</h2>
                  {medicalInfo && (
                    <p className="text-sm text-gray-500">
                      Last updated: {formatDateTime(medicalInfo.updatedAt)}
                    </p>
                  )}
                </div>
                {renderTreatmentSection()}
              </div>
            )}

            {activeTab === 'notes' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Doctor/Nurse Notes</h2>
                  {medicalInfo && (
                    <p className="text-sm text-gray-500">
                      Last updated: {formatDateTime(medicalInfo.updatedAt)}
                    </p>
                  )}
                </div>
                {renderNotesSection()}
              </div>
            )}

            {activeTab === 'consent' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Consent & Legal Documents</h2>
                  {medicalInfo && (
                    <p className="text-sm text-gray-500">
                      Last updated: {formatDateTime(medicalInfo.updatedAt)}
                    </p>
                  )}
                </div>
                {renderConsentSection()}
              </div>
            )}

            {activeTab === 'infrastructure' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Hospital Infrastructure</h2>
                  {medicalInfo && (
                    <p className="text-sm text-gray-500">
                      Last updated: {formatDateTime(medicalInfo.updatedAt)}
                    </p>
                  )}
                </div>
                {renderInfrastructureSection()}
              </div>
            )}

            {activeTab === 'discharge' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Discharge Details</h2>
                  {medicalInfo && (
                    <p className="text-sm text-gray-500">
                      Last updated: {formatDateTime(medicalInfo.updatedAt)}
                    </p>
                  )}
                </div>
                {renderDischargeSection()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDisplay;