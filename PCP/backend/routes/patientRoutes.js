const express = require('express');
const router = express.Router();
const PatientReg = require('../models/PatientReg');

// Generate a unique 6-digit registration number
const generateRegNumber = async () => {
    let isUnique = false;
    let regNumber;
    
    while (!isUnique) {
        // Generate a random 6-digit number
        regNumber = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Check if it already exists in the database
        const existingPatient = await PatientReg.findOne({ regNumber });
        
        if (!existingPatient) {
            isUnique = true;
        }
    }
    
    return regNumber;
};

// Register a new patient
router.post('/register', async (req, res) => {
    try {
        // Generate unique registration number
        const regNumber = await generateRegNumber();
        
        // Create new patient document with the form data and registration number
        const newPatient = new PatientReg({
            regNumber,
            ...req.body
        });
        
        // Save to database
        const savedPatient = await newPatient.save();
        
        // Return success with the registration number
        res.status(201).json({ 
            success: true, 
            message: 'Patient registered successfully',
            regNumber,
            patient: savedPatient
        });
    } catch (error) {
        console.error('Error registering patient:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error registering patient', 
            error: error.message 
        });
    }
});

// Get patient by registration number
router.get('/:regNumber', async (req, res) => {
    try {
        const patient = await PatientReg.findOne({ regNumber: req.params.regNumber });
        
        if (!patient) {
            return res.status(404).json({ 
                success: false, 
                message: 'Patient not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            patient 
        });
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching patient', 
            error: error.message 
        });
    }
});

// Update patient by registration number
router.put('/:regNumber', async (req, res) => {
    try {
        const updatedPatient = await PatientReg.findOneAndUpdate(
            { regNumber: req.params.regNumber },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedPatient) {
            return res.status(404).json({ 
                success: false, 
                message: 'Patient not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Patient updated successfully',
            patient: updatedPatient 
        });
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating patient', 
            error: error.message 
        });
    }
});

module.exports = router;