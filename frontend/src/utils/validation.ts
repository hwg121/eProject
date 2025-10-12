// Validation utility functions for form inputs

/**
 * Validates email address format and length
 * @param email - Email string to validate
 * @param required - Whether email is required (default: true)
 * @returns Error message or null if valid
 */
export const validateEmail = (email: string, required: boolean = true): string | null => {
  if (!email || email.trim() === '') {
    return required ? 'Email is required' : null;
  }

  const trimmedEmail = email.trim();
  
  // Length validation
  if (trimmedEmail.length < 5) return 'Email must be at least 5 characters';
  if (trimmedEmail.length > 254) return 'Email must not exceed 254 characters'; // RFC 5321 limit
  
  // Format validation with stricter regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(trimmedEmail)) return 'Invalid email format';
  
  // Additional checks
  if (trimmedEmail.includes('..')) return 'Email cannot contain consecutive dots';
  if (trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) return 'Email cannot start or end with a dot';
  
  return null;
};

/**
 * Validates email uniqueness (for user registration/editing)
 * @param email - Email string to validate
 * @param existingEmails - Array of existing emails to check against
 * @param currentEmail - Current user's email (for editing, to exclude from duplicate check)
 * @param required - Whether email is required (default: true)
 * @returns Error message or null if valid
 */
export const validateEmailUnique = (
  email: string, 
  existingEmails: string[] = [], 
  currentEmail?: string,
  required: boolean = true
): string | null => {
  // First validate email format
  const formatError = validateEmail(email, required);
  if (formatError) return formatError;
  
  if (!email || email.trim() === '') {
    return required ? 'Email is required' : null;
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  const currentEmailLower = currentEmail ? currentEmail.trim().toLowerCase() : '';
  
  // Check if email already exists (excluding current user's email)
  const isDuplicate = existingEmails.some(existingEmail => {
    const existingEmailLower = existingEmail.trim().toLowerCase();
    return existingEmailLower === trimmedEmail && existingEmailLower !== currentEmailLower;
  });
  
  if (isDuplicate) {
    return 'Email already exists. Please use a different email address.';
  }
  
  return null;
};

/**
 * Validates password strength and format
 * @param password - Password string to validate
 * @param required - Whether password is required (default: true)
 * @param minLength - Minimum length (default: 8)
 * @param maxLength - Maximum length (default: 128)
 * @returns Error message or null if valid
 */
export const validatePassword = (
  password: string, 
  required: boolean = true, 
  minLength: number = 8, 
  maxLength: number = 128
): string | null => {
  if (!password || password.trim() === '') {
    return required ? 'Password is required' : null;
  }

  // Length validation
  if (password.length < minLength) return `Password must be at least ${minLength} characters`;
  if (password.length > maxLength) return `Password must not exceed ${maxLength} characters`;
  
  // Character validation
  if (password.includes(' ')) return 'Password cannot contain spaces';
  
  // Optional: Add strength requirements
  // const hasUpperCase = /[A-Z]/.test(password);
  // const hasLowerCase = /[a-z]/.test(password);
  // const hasNumbers = /\d/.test(password);
  // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return null;
};

/**
 * Validates URL format
 * @param url - URL string to validate
 * @param required - Whether URL is required (default: false)
 * @returns Error message or null if valid
 */
export const validateURL = (url: string, required: boolean = false): string | null => {
  if (!url || url.trim() === '') return required ? 'URL is required' : null;
  
  const trimmedUrl = url.trim();
  
  try {
    const urlObj = new URL(trimmedUrl);
    
    // Check protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return 'URL must start with http:// or https://';
    }
    
    // Check hostname
    if (!urlObj.hostname || urlObj.hostname.length < 3) {
      return 'Invalid URL format';
    }
    
    // Check for valid domain
    if (!urlObj.hostname.includes('.')) {
      return 'Invalid URL format';
    }
    
    return null;
  } catch {
    return 'Invalid URL format';
  }
};

/**
 * Validates numeric values with range constraints
 * @param value - Value to validate (number, string, undefined, null)
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @param fieldName - Name of the field for error messages
 * @param required - Whether value is required (default: false)
 * @returns Error message or null if valid
 */
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
  
  const stringValue = String(value).trim();
  if (stringValue === '') {
    return required ? `${fieldName} is required` : null;
  }
  
  const num = parseFloat(stringValue);
  if (isNaN(num)) {
    return `${fieldName} must be a valid number`;
  }
  
  if (!isFinite(num)) {
    return `${fieldName} must be a finite number`;
  }
  
  if (num < min) return `${fieldName} must be at least ${min}`;
  if (num > max) return `${fieldName} must not exceed ${max}`;
  
  return null;
};

/**
 * Validates text content with length constraints
 * @param text - Text to validate
 * @param min - Minimum length
 * @param max - Maximum length
 * @param fieldName - Name of the field for error messages
 * @param required - Whether text is required (default: true)
 * @returns Error message or null if valid
 */
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
  if (trimmed.length > max) {
    return `${fieldName} must not exceed ${max} characters`;
  }
  return null;
};

/**
 * Validates phone number format
 * @param phone - Phone number to validate
 * @param required - Whether phone is required (default: true)
 * @returns Error message or null if valid
 */
export const validatePhone = (phone: string, required: boolean = true): string | null => {
  if (!phone || phone.trim() === '') {
    return required ? 'Phone number is required' : null;
  }
  
  // Remove spaces, dashes, parentheses, plus signs
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  
  // Check if contains only digits after cleaning
  if (!/^\d+$/.test(cleaned)) {
    return 'Phone number can only contain digits, spaces, dashes, parentheses, and plus signs';
  }
  
  if (cleaned.length < 10) return 'Phone must be at least 10 digits';
  if (cleaned.length > 15) return 'Phone must not exceed 15 digits';
  
  return null;
};

/**
 * Validates phone number uniqueness (for user registration/editing)
 * @param phone - Phone number to validate
 * @param existingPhones - Array of existing phone numbers to check against
 * @param currentPhone - Current user's phone (for editing, to exclude from duplicate check)
 * @param required - Whether phone is required (default: true)
 * @returns Error message or null if valid
 */
export const validatePhoneUnique = (
  phone: string, 
  existingPhones: string[] = [], 
  currentPhone?: string,
  required: boolean = true
): string | null => {
  // First validate phone format
  const formatError = validatePhone(phone, required);
  if (formatError) return formatError;
  
  if (!phone || phone.trim() === '') {
    return required ? 'Phone number is required' : null;
  }
  
  // Clean phone numbers for comparison
  const cleanPhone = (phoneNum: string) => phoneNum.replace(/[\s\-\(\)\+]/g, '');
  
  const cleanedPhone = cleanPhone(phone.trim());
  const cleanedCurrentPhone = currentPhone ? cleanPhone(currentPhone.trim()) : '';
  
  // Check if phone already exists (excluding current user's phone)
  const isDuplicate = existingPhones.some(existingPhone => {
    const cleanedExisting = cleanPhone(existingPhone.trim());
    return cleanedExisting === cleanedPhone && cleanedExisting !== cleanedCurrentPhone;
  });
  
  if (isDuplicate) {
    return 'Phone number already exists. Please use a different phone number.';
  }
  
  return null;
};

/**
 * Validates required fields
 * @param value - Value to validate
 * @param fieldName - Name of the field for error messages
 * @returns Error message or null if valid
 */
export const validateRequired = (value: any, fieldName: string): string | null => {
  if (value === undefined || value === null) {
    return `${fieldName} is required`;
  }
  
  if (typeof value === 'string') {
    if (value.trim() === '') {
      return `${fieldName} is required`;
    }
  }
  
  if (typeof value === 'boolean') {
    return null; // Boolean values are always valid
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `${fieldName} is required`;
    }
  }
  
  if (typeof value === 'object' && value !== null) {
    if (Object.keys(value).length === 0) {
      return `${fieldName} is required`;
    }
  }
  
  return null;
};

/**
 * Validates username format
 * @param username - Username to validate
 * @param required - Whether username is required (default: true)
 * @returns Error message or null if valid
 */
export const validateUsername = (username: string, required: boolean = true): string | null => {
  if (!username || username.trim() === '') {
    return required ? 'Username is required' : null;
  }
  
  const trimmed = username.trim();
  
  if (trimmed.length < 3) return 'Username must be at least 3 characters';
  if (trimmed.length > 30) return 'Username must not exceed 30 characters';
  
  // Only allow alphanumeric characters, underscores, and hyphens
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(trimmed)) {
    return 'Username can only contain letters, numbers, underscores, and hyphens';
  }
  
  // Cannot start or end with underscore or hyphen
  if (trimmed.startsWith('_') || trimmed.startsWith('-') || 
      trimmed.endsWith('_') || trimmed.endsWith('-')) {
    return 'Username cannot start or end with underscore or hyphen';
  }
  
  return null;
};

/**
 * Validates username uniqueness (for user registration/editing)
 * @param username - Username to validate
 * @param existingUsernames - Array of existing usernames to check against
 * @param currentUsername - Current user's username (for editing, to exclude from duplicate check)
 * @param required - Whether username is required (default: true)
 * @returns Error message or null if valid
 */
export const validateUsernameUnique = (
  username: string, 
  existingUsernames: string[] = [], 
  currentUsername?: string,
  required: boolean = true
): string | null => {
  // First validate username format
  const formatError = validateUsername(username, required);
  if (formatError) return formatError;
  
  if (!username || username.trim() === '') {
    return required ? 'Username is required' : null;
  }
  
  const trimmedUsername = username.trim().toLowerCase();
  const currentUsernameLower = currentUsername ? currentUsername.trim().toLowerCase() : '';
  
  // Check if username already exists (excluding current user's username)
  const isDuplicate = existingUsernames.some(existingUsername => {
    const existingUsernameLower = existingUsername.trim().toLowerCase();
    return existingUsernameLower === trimmedUsername && existingUsernameLower !== currentUsernameLower;
  });
  
  if (isDuplicate) {
    return 'Username already exists. Please choose a different username.';
  }
  
  return null;
};

/**
 * Validates date format and range
 * @param date - Date string to validate
 * @param required - Whether date is required (default: true)
 * @param minDate - Minimum allowed date
 * @param maxDate - Maximum allowed date
 * @returns Error message or null if valid
 */
export const validateDate = (
  date: string, 
  required: boolean = true,
  minDate?: Date,
  maxDate?: Date
): string | null => {
  if (!date || date.trim() === '') {
    return required ? 'Date is required' : null;
  }
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date format';
  }
  
  if (minDate && dateObj < minDate) {
    return `Date must be after ${minDate.toLocaleDateString()}`;
  }
  
  if (maxDate && dateObj > maxDate) {
    return `Date must be before ${maxDate.toLocaleDateString()}`;
  }
  
  return null;
};

/**
 * Validates file size and type
 * @param file - File object to validate
 * @param maxSizeMB - Maximum file size in MB (default: 10)
 * @param allowedTypes - Array of allowed MIME types (default: ['image/jpeg', 'image/png', 'image/gif'])
 * @returns Error message or null if valid
 */
export const validateFile = (
  file: File,
  maxSizeMB: number = 10,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
): string | null => {
  if (!file) return 'File is required';
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    return `File size must not exceed ${maxSizeMB}MB`;
  }
  
  if (!allowedTypes.includes(file.type)) {
    return `File type must be one of: ${allowedTypes.join(', ')}`;
  }
  
  return null;
};

// Helper to validate entire form
export interface FormErrors {
  [key: string]: string | null;
}

/**
 * Checks if form has any validation errors
 * @param errors - Object containing field errors
 * @returns True if any errors exist
 */
export const hasErrors = (errors: FormErrors): boolean => {
  return Object.values(errors).some(error => error !== null && error !== undefined);
};

/**
 * Gets the first validation error from form errors
 * @param errors - Object containing field errors
 * @returns First error message or null
 */
export const getFirstError = (errors: FormErrors): string | null => {
  const firstError = Object.values(errors).find(error => error !== null && error !== undefined);
  return firstError || null;
};

/**
 * Counts the number of validation errors
 * @param errors - Object containing field errors
 * @returns Number of errors
 */
export const getErrorCount = (errors: FormErrors): number => {
  return Object.values(errors).filter(error => error !== null && error !== undefined).length;
};

/**
 * Clears all validation errors
 * @param errors - Object containing field errors
 * @returns New object with all errors cleared
 */
export const clearErrors = (errors: FormErrors): FormErrors => {
  const cleared: FormErrors = {};
  Object.keys(errors).forEach(key => {
    cleared[key] = null;
  });
  return cleared;
};


