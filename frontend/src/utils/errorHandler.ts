/**
 * Extract error message from API response with priority fallback
 * 
 * Priority order:
 * 1. error.response.data.message (backend message)
 * 2. error.response.data.error (backend error field)
 * 3. error.response.data.errors (validation errors - first one)
 * 4. error.message (generic error message)
 * 5. defaultMessage (fallback)
 * 
 * @param error - The error object from API call
 * @param defaultMessage - Default message if no error message found
 * @returns Extracted error message string
 */
export function extractErrorMessage(error: any, defaultMessage: string = 'An error occurred. Please try again.'): string {
  // Priority 1: Backend message field
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Priority 2: Backend error field
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  
  // Priority 3: Backend errors object (validation errors)
  if (error?.response?.data?.errors) {
    const errors = error.response.data.errors;
    const firstError = Object.values(errors)[0];
    return Array.isArray(firstError) ? firstError[0] : String(firstError);
  }
  
  // Priority 4: Error message property
  if (error?.message) {
    return error.message;
  }
  
  // Priority 5: Default message
  return defaultMessage;
}

/**
 * Extract all validation errors from API response
 * 
 * @param error - The error object from API call
 * @returns Object with field names as keys and error messages as values
 */
export function extractValidationErrors(error: any): Record<string, string> {
  if (error?.response?.data?.errors && typeof error.response.data.errors === 'object') {
    const errors: Record<string, string> = {};
    
    Object.entries(error.response.data.errors).forEach(([field, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        errors[field] = messages[0];
      } else if (typeof messages === 'string') {
        errors[field] = messages;
      }
    });
    
    return errors;
  }
  
  return {};
}

/**
 * Check if error is a validation error (422 status)
 * 
 * @param error - The error object from API call
 * @returns True if validation error, false otherwise
 */
export function isValidationError(error: any): boolean {
  return error?.response?.status === 422;
}

/**
 * Check if error is an authentication error (401/403 status)
 * 
 * @param error - The error object from API call
 * @returns True if auth error, false otherwise
 */
export function isAuthError(error: any): boolean {
  return error?.response?.status === 401 || error?.response?.status === 403;
}

/**
 * Check if error is a not found error (404 status)
 * 
 * @param error - The error object from API call
 * @returns True if not found error, false otherwise
 */
export function isNotFoundError(error: any): boolean {
  return error?.response?.status === 404;
}

/**
 * Check if error is a conflict error (409 status)
 * 
 * @param error - The error object from API call
 * @returns True if conflict error, false otherwise
 */
export function isConflictError(error: any): boolean {
  return error?.response?.status === 409;
}







