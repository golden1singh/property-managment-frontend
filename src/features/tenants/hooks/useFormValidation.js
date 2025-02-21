import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useFormValidation = (formData) => {
  const { t } = useTranslation();
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    if (!value && isRequired(name)) {
      return t('validation.required');
    }

    switch (name) {
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) 
          ? t('validation.invalidEmail') 
          : '';

      case 'phone':
      case 'emergencyPhone':
        return !/^\d{10}$/.test(value) 
          ? t('validation.invalidPhone') 
          : '';

      case 'monthlyIncome':
        return value <= 0 
          ? t('validation.invalidIncome') 
          : '';

      case 'rentAmount':
      case 'securityDeposit':
        return value <= 0 
          ? t('validation.invalidAmount') 
          : '';

      case 'idProofNumber':
        switch (formData.idProofType) {
          case 'aadhar':
            return !/^\d{12}$/.test(value) 
              ? t('validation.invalidAadhar') 
              : '';
          case 'pan':
            return !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value) 
              ? t('validation.invalidPan') 
              : '';
          default:
            return '';
        }

      default:
        return '';
    }
  };

  // Define required fields
  const isRequired = (fieldName) => {
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'emergencyContact',
      'emergencyPhone',
      'occupation',
      'currentAddress',
      'permanentAddress',
      'idProofType',
      'idProofNumber',
      'plotNumber',
      'roomNumber',
      'rentAmount',
      'securityDeposit',
      'leaseStartDate'
    ];
    return requiredFields.includes(fieldName);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    const newTouched = {};

    // Validate all fields
    Object.keys(formData).forEach(fieldName => {
      newTouched[fieldName] = true;
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);
    return newErrors;
  };

  return {
    errors,
    touched,
    handleBlur,
    validateForm,
    validateField
  };
}; 