const mongoose = require('mongoose');

const patientRegSchema = new mongoose.Schema({
    // Patient Information
    regNumber: {
        type: String,
        required: true,
        unique: true,
        length: 6
    },
    firstName: String,
    middleName: String,
    lastName: String,
    gender: String,
    age: Number,
    dob: Date,
    pContactNo: String,
    address: String,
    email: String,
    bloodGroup: String,
    height: Number,
    weight: Number,

    // Emergency Contact Information
    eFirstName: String,
    eMiddleName: String,
    eLastName: String,
    eContactNo: String,
    relationship: String,
    eAddress: String,

    // Admission Details
    admissionType: String,
    admissionDate: Date,
    department: String,
    wardType: String,
    primaryComplaint: String,
    additionalNotes: String,
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PatientReg', patientRegSchema);