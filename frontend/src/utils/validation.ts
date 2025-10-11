// Validation utility functions for form inputs

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  if (email.length < 5) return 'Email must be at least 5 characters';
  if (email.length > 100) return 'Email must not exceed 100 characters';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (password.length > 50) return 'Password must not exceed 50 characters';
  return null;
};

export const validateURL = (url: string, required: boolean = false): string | null => {
  if (!url || url.trim() === '') return required ? 'URL is required' : null;
  const urlRegex = /^https?:\/\/.+\..+/;
  if (!urlRegex.test(url)) return 'Invalid URL format (must start with http:// or https://)';
  return null;
};

export const validateNumber = (
  value: number | string | undefined | null,
  min: number,
  max: number,
  fieldName: string,
  required: boolean = false
): string | null => {
  if (value === undefined || value === null || value === '') {
    return required ? `${fieldName} is required` : null;
  }
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) {
    return required ? `${fieldName} is required` : null;
  }
  if (num < min) return `${fieldName} must be at least ${min}`;
  if (num > max) return `${fieldName} must not exceed ${max}`;
  return null;
};

export const validateText = (
  text: string | undefined | null,
  min: number,
  max: number,
  fieldName: string,
  required: boolean = true
): string | null => {
  if (!text || text.trim().length === 0) {
    return required ? `${fieldName} is required` : null;
  }
  const trimmed = text.trim();
  if (trimmed.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  if (text.length > max) {
    return `${fieldName} must not exceed ${max} characters`;
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return 'Phone number is required';
  // Remove spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.length < 10) return 'Phone must be at least 10 digits';
  if (cleaned.length > 15) return 'Phone must not exceed 15 digits';
  const phoneRegex = /^[0-9\+\-\(\)\s]+$/;
  if (!phoneRegex.test(phone)) return 'Invalid phone format';
  return null;
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (value === undefined || value === null || value === '' || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

// Helper to validate entire form
export interface FormErrors {
  [key: string]: string | null;
}

export const hasErrors = (errors: FormErrors): boolean => {
  return Object.values(errors).some(error => error !== null);
};

export const getFirstError = (errors: FormErrors): string | null => {
  const firstError = Object.values(errors).find(error => error !== null);
  return firstError || null;
};

