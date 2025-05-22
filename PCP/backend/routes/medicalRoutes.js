const express = require('express');
const router = express.Router();
const MedicalInfo = require('../models/MedicalInfo'); // Adjust the path to your model

// GET - Fetch medical information for a patient
router.get('/patients/:regNumber/medical', async (req, res) => {
  try {
    const { regNumber } = req.params;
    
    // Find medical information by registration number
    const medicalInfo = await MedicalInfo.findOne({ regNumber });
    
    if (!medicalInfo) {
      return res.status(404).json({ 
        message: 'No medical information found for this patient',
        success: false 
      });
    }

    res.status(200).json({
      success: true,
      data: medicalInfo
    });
  } catch (error) {
    console.error('Error fetching medical information:', error);
    res.status(500).json({ 
      message: 'Server error while fetching medical information',
      error: error.message,
      success: false 
    });
  }
});

// POST - Create or Update medical information for a patient
router.post('/patients/:regNumber/medical', async (req, res) => {
  try {
    const { regNumber } = req.params;
    const medicalData = req.body;

    // Add regNumber to the data
    medicalData.regNumber = regNumber;

    // Check if medical information already exists
    let medicalInfo = await MedicalInfo.findOne({ regNumber });

    if (medicalInfo) {
      // Update existing medical information
      Object.keys(medicalData).forEach(key => {
        if (key !== 'regNumber') {
          medicalInfo[key] = medicalData[key];
        }
      });
      
      medicalInfo.updatedAt = new Date();
      await medicalInfo.save();
      
      res.status(200).json({
        success: true,
        message: 'Medical information updated successfully',
        data: medicalInfo
      });
    } else {
      // Create new medical information
      medicalInfo = new MedicalInfo(medicalData);
      await medicalInfo.save();
      
      res.status(201).json({
        success: true,
        message: 'Medical information created successfully',
        data: medicalInfo
      });
    }
  } catch (error) {
    console.error('Error saving medical information:', error);
    res.status(500).json({ 
      message: 'Server error while saving medical information',
      error: error.message,
      success: false 
    });
  }
});

// PUT - Update specific section of medical information
router.put('/patients/:regNumber/medical/:section', async (req, res) => {
  try {
    const { regNumber, section } = req.params;
    const updateData = req.body;

    const medicalInfo = await MedicalInfo.findOne({ regNumber });
    
    if (!medicalInfo) {
      return res.status(404).json({ 
        message: 'No medical information found for this patient',
        success: false 
      });
    }

    // Update specific section
    if (medicalInfo[section] !== undefined) {
      medicalInfo[section] = { ...medicalInfo[section], ...updateData };
      medicalInfo.updatedAt = new Date();
      await medicalInfo.save();
      
      res.status(200).json({
        success: true,
        message: `${section} updated successfully`,
        data: medicalInfo
      });
    } else {
      res.status(400).json({
        success: false,
        message: `Invalid section: ${section}`
      });
    }
  } catch (error) {
    console.error('Error updating medical section:', error);
    res.status(500).json({ 
      message: 'Server error while updating medical section',
      error: error.message,
      success: false 
    });
  }
});

// DELETE - Delete medical information for a patient
router.delete('/patients/:regNumber/medical', async (req, res) => {
  try {
    const { regNumber } = req.params;
    
    const result = await MedicalInfo.findOneAndDelete({ regNumber });
    
    if (!result) {
      return res.status(404).json({ 
        message: 'No medical information found for this patient',
        success: false 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Medical information deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting medical information:', error);
    res.status(500).json({ 
      message: 'Server error while deleting medical information',
      error: error.message,
      success: false 
    });
  }
});

// GET - Get medical information summary for multiple patients
router.get('/medical/summary', async (req, res) => {
  try {
    const { department, dateFrom, dateTo } = req.query;
    
    let query = {};
    
    if (department) {
      query.department = department;
    }
    
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo);
      }
    }

    const medicalInfos = await MedicalInfo.find(query)
      .select('regNumber department admissionDateTime chiefComplaint initialDiagnosis createdAt updatedAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: medicalInfos.length,
      data: medicalInfos
    });
  } catch (error) {
    console.error('Error fetching medical summary:', error);
    res.status(500).json({ 
      message: 'Server error while fetching medical summary',
      error: error.message,
      success: false 
    });
  }
});

module.exports = router;