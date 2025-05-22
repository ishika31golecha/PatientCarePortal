const express = require('express');
const router = express.Router();
const PatientReg = require('../models/PatientReg');
const MedicalInfo = require('../models/MedicalInfo');

// Generate a unique 6-digit registration number
const generateRegNumber = async () => {
    let isUnique = false;
    let regNumber;

    while (!isUnique) {
        regNumber = Math.floor(100000 + Math.random() * 900000).toString();
        const existingPatient = await PatientReg.findOne({ regNumber });
        if (!existingPatient) isUnique = true;
    }

    return regNumber;
};

// Register a new patient
router.post('/register', async (req, res) => {
    try {
        const regNumber = await generateRegNumber();
        const newPatient = new PatientReg({ regNumber, ...req.body });
        const savedPatient = await newPatient.save();

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
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        res.status(200).json({ success: true, patient });
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
            return res.status(404).json({ success: false, message: 'Patient not found' });
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

// Get medical information
router.get('/:regNumber/medical', async (req, res) => {
    try {
        const { regNumber } = req.params;
        const patient = await PatientReg.findOne({ regNumber });
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        const medicalInfo = await MedicalInfo.findOne({ regNumber });
        if (!medicalInfo) {
            return res.status(404).json({
                success: false,
                message: 'No medical information found for this patient'
            });
        }

        res.status(200).json({ success: true, data: medicalInfo });
    } catch (error) {
        console.error('Error fetching medical information:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching medical information',
            error: error.message
        });
    }
});

// Create/Update medical information
router.post('/:regNumber/medical', async (req, res) => {
    try {
        const { regNumber } = req.params;
        const medicalData = req.body;

        const patient = await PatientReg.findOne({ regNumber });
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        medicalData.regNumber = regNumber;
        medicalData.updatedAt = new Date();

        let medicalInfo = await MedicalInfo.findOne({ regNumber });

        if (medicalInfo) {
            medicalInfo = await MedicalInfo.findOneAndUpdate(
                { regNumber },
                medicalData,
                { new: true, runValidators: true }
            );
            res.status(200).json({
                success: true,
                message: 'Medical information updated successfully',
                data: medicalInfo
            });
        } else {
            medicalData.createdAt = new Date();
            medicalInfo = new MedicalInfo(medicalData);
            await medicalInfo.save();
            res.status(201).json({
                success: true,
                message: 'Medical information saved successfully',
                data: medicalInfo
            });
        }
    } catch (error) {
        console.error('Error saving medical information:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving medical information',
            error: error.message
        });
    }
});

// Get full patient information (basic + medical)
router.get('/:regNumber/complete', async (req, res) => {
    try {
        const { regNumber } = req.params;

        const patient = await PatientReg.findOne({ regNumber });
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        const medicalInfo = await MedicalInfo.findOne({ regNumber });

        res.status(200).json({
            success: true,
            patient: patient,
            medicalInfo: medicalInfo || null
        });
    } catch (error) {
        console.error('Error fetching complete patient information:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching patient information',
            error: error.message
        });
    }
});

// Delete medical information
router.delete('/:regNumber/medical', async (req, res) => {
    try {
        const { regNumber } = req.params;

        const patient = await PatientReg.findOne({ regNumber });
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        const deletedMedicalInfo = await MedicalInfo.findOneAndDelete({ regNumber });

        if (!deletedMedicalInfo) {
            return res.status(404).json({
                success: false,
                message: 'No medical information found to delete'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Medical information deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting medical information:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting medical information',
            error: error.message
        });
    }
});

module.exports = router;
