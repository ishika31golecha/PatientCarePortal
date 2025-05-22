const mongoose = require('mongoose');

const medicalInfoSchema = new mongoose.Schema({
  regNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Medical History
  medicalConditions: {
    type: String,
    default: ''
  },
  pastSurgeries: {
    type: String,
    default: ''
  },
  allergies: {
    medication: {
      type: String,
      default: ''
    },
    food: {
      type: String,
      default: ''
    },
    environmental: {
      type: String,
      default: ''
    }
  },
  ongoingMedications: {
    type: String,
    default: ''
  },
  familyMedicalHistory: {
    type: String,
    default: ''
  },

  // Admission Details
  admissionDateTime: {
    type: Date,
    default: null
  },
  department: {
    type: String,
    default: ''
  },
  referredBy: {
    type: String,
    default: ''
  },
  admittingDoctor: {
    type: String,
    default: ''
  },
  chiefComplaint: {
    type: String,
    default: ''
  },
  initialDiagnosis: {
    type: String,
    default: ''
  },

  // Vitals and Initial Observations
  vitals: {
    bloodPressure: {
      type: String,
      default: ''
    },
    heartRate: {
      type: String,
      default: ''
    },
    respiratoryRate: {
      type: String,
      default: ''
    },
    temperature: {
      type: String,
      default: ''
    },
    oxygenSaturation: {
      type: String,
      default: ''
    },
    weight: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    }
  },

  // Diagnostic Tests
  diagnosticTests: {
    bloodTests: {
      type: String,
      default: ''
    },
    imaging: {
      type: String,
      default: ''
    },
    ecg: {
      type: String,
      default: ''
    },
    otherTests: {
      type: String,
      default: ''
    }
  },

  // Treatment Plan
  treatmentPlan: {
    medications: {
      type: String,
      default: ''
    },
    ivFluids: {
      type: String,
      default: ''
    },
    surgicalPlan: {
      type: String,
      default: ''
    },
    dietaryRestrictions: {
      type: String,
      default: ''
    },
    supportServices: {
      type: String,
      default: ''
    }
  },

  // Doctor/Nurse Notes
  notes: {
    progressNotes: {
      type: String,
      default: ''
    },
    clinicalObservations: {
      type: String,
      default: ''
    },
    nursingAssessments: {
      type: String,
      default: ''
    },
    handoverNotes: {
      type: String,
      default: ''
    }
  },

  // Consent and Legal Documents
  consent: {
    surgeryConsent: {
      type: Boolean,
      default: false
    },
    anesthesiaConsent: {
      type: Boolean,
      default: false
    },
    treatmentConsent: {
      type: Boolean,
      default: false
    },
    idProofSubmitted: {
      type: Boolean,
      default: false
    },
    insuranceDetails: {
      type: String,
      default: ''
    }
  },

  // Hospital Infrastructure
  infrastructure: {
    bedNumber: {
      type: String,
      default: ''
    },
    roomType: {
      type: String,
      default: ''
    },
    assignedNurse: {
      type: String,
      default: ''
    }
  },

  // Discharge Details
  discharge: {
    dischargeSummary: {
      type: String,
      default: ''
    },
    finalDiagnosis: {
      type: String,
      default: ''
    },
    dischargeMedications: {
      type: String,
      default: ''
    },
    followUpInstructions: {
      type: String,
      default: ''
    },
    referralDetails: {
      type: String,
      default: ''
    }
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
medicalInfoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
medicalInfoSchema.index({ regNumber: 1 });
medicalInfoSchema.index({ createdAt: -1 });

module.exports = mongoose.model('MedicalInfo', medicalInfoSchema);