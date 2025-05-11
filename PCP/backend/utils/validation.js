// Simple form validation helpers

/**
 * Validates required fields in form data
 * @param {Object} formData - Form data to validate
 * @param {Array} requiredFields - Array of field names that are required
 * @returns {Object} - { isValid, errors }
 */
export const validateRequired = (formData, requiredFields) => {
  const errors = {};
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!formData[field] || formData[field].trim() === '') {
      errors[field] = `${formatFieldName(field)} is required`;
      isValid = false;
    }
  });
  
  return { isValid, errors };
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const isValidPhone = (phone) => {
  // Match digits, spaces, dashes, parentheses
  const phoneRegex = /^[0-9()\- +]{10,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Format field name for display
 * @param {string} fieldName - camelCase field name
 * @returns {string} - Human readable field name
 */
export const formatFieldName = (fieldName) => {
  // Convert camelCase to Title Case with spaces
  return fieldName
    // Insert a space before each capital letter
    .replace(/([A-Z])/g, ' $1')
    // Capitalize the first letter
    .replace(/^./, str => str.toUpperCase())
    // Handle special cases
    .replace('P Contact No', 'Contact Number')
    .replace('E Contact No', 'Emergency Contact Number')
    .replace('Dob', 'Date of Birth');
};

/**
 * Validates the entire patient registration form
 * @param {Object} formData - The complete form data
 * @param {string} currentSection - Current form section being validated
 * @returns {Object} - { isValid, errors }
 */
export const validatePatientForm = (formData, currentSection = 'all') => {
  let errors = {};
  let isValid = true;
  
  // Define required fields for each section
  const requiredFieldsBySection = {
    patient: [
      'firstName', 'lastName', 'gender', 'age', 'dob', 
      'pContactNo', 'address', 'email', 'bloodGroup', 'weight'
    ],
    emergency: [
      'eFirstName', 'eLastName', 'eContactNo', 'relationship'
    ],
    admission: [
      'admissionType', 'admissionDate', 'department', 'wardType', 'primaryComplaint'
    ]
  };
  
  // Determine which sections to validate
  const sectionsToValidate = currentSection === 'all' 
    ? ['patient', 'emergency', 'admission'] 
    : [currentSection];
  
  // Validate required fields for each section
  sectionsToValidate.forEach(section => {
    const { isValid: sectionValid, errors: sectionErrors } = validateRequired(
      formData, 
      requiredFieldsBySection[section]
    );
    
    if (!sectionValid) {
      isValid = false;
      errors = { ...errors, ...sectionErrors };
    }
  });
  
  // Validate email if present
  if (formData.email && !isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }
  
  // Validate phone numbers if present
  if (formData.pContactNo && !isValidPhone(formData.pContactNo)) {
    errors.pContactNo = 'Please enter a valid phone number';
    isValid = false;
  }
  
  if (formData.eContactNo && !isValidPhone(formData.eContactNo)) {
    errors.eContactNo = 'Please enter a valid emergency contact number';
    isValid = false;
  }
  
  return { isValid, errors };
};

export default {
  validateRequired,
  isValidEmail,
  isValidPhone,
  formatFieldName,
  validatePatientForm
};