// Test file for validation utilities
// Run with: npm test validation.test.ts

import {
  validateEmail,
  validateEmailUnique,
  validatePassword,
  validateURL,
  validateNumber,
  validateText,
  validatePhone,
  validatePhoneUnique,
  validateRequired,
  validateUsername,
  validateUsernameUnique,
  validateDate,
  validateFile,
  hasErrors,
  getFirstError,
  getErrorCount,
  clearErrors
} from '../validation';

// Email validation tests
describe('validateEmail', () => {
  test('should validate correct email', () => {
    expect(validateEmail('test@example.com')).toBeNull();
    expect(validateEmail('user.name@domain.co.uk')).toBeNull();
  });

  test('should reject invalid emails', () => {
    expect(validateEmail('invalid-email')).toBe('Invalid email format');
    expect(validateEmail('test@')).toBe('Invalid email format');
    expect(validateEmail('@domain.com')).toBe('Invalid email format');
    expect(validateEmail('test..test@domain.com')).toBe('Email cannot contain consecutive dots');
    expect(validateEmail('.test@domain.com')).toBe('Email cannot start or end with a dot');
  });

  test('should handle required/optional', () => {
    expect(validateEmail('', true)).toBe('Email is required');
    expect(validateEmail('', false)).toBeNull();
  });
});

// Email uniqueness validation tests
describe('validateEmailUnique', () => {
  test('should validate unique email', () => {
    const existingEmails = ['user1@example.com', 'user2@test.com'];
    expect(validateEmailUnique('newuser@example.com', existingEmails)).toBeNull();
  });

  test('should reject duplicate email', () => {
    const existingEmails = ['user1@example.com', 'user2@test.com'];
    expect(validateEmailUnique('user1@example.com', existingEmails))
      .toBe('Email already exists. Please use a different email address.');
  });

  test('should allow same email when editing current user', () => {
    const existingEmails = ['user1@example.com', 'user2@test.com'];
    expect(validateEmailUnique('user1@example.com', existingEmails, 'user1@example.com'))
      .toBeNull();
  });

  test('should handle case insensitive comparison', () => {
    const existingEmails = ['User1@Example.COM'];
    expect(validateEmailUnique('user1@example.com', existingEmails))
      .toBe('Email already exists. Please use a different email address.');
  });
});

// Password validation tests
describe('validatePassword', () => {
  test('should validate correct password', () => {
    expect(validatePassword('password123')).toBeNull();
    expect(validatePassword('MySecure123!')).toBeNull();
  });

  test('should reject invalid passwords', () => {
    expect(validatePassword('123')).toBe('Password must be at least 8 characters');
    expect(validatePassword('')).toBe('Password is required');
    expect(validatePassword('pass with space')).toBe('Password cannot contain spaces');
  });

  test('should handle custom length requirements', () => {
    expect(validatePassword('123', true, 10)).toBe('Password must be at least 10 characters');
  });
});

// URL validation tests
describe('validateURL', () => {
  test('should validate correct URLs', () => {
    expect(validateURL('https://example.com')).toBeNull();
    expect(validateURL('http://subdomain.example.com/path')).toBeNull();
  });

  test('should reject invalid URLs', () => {
    expect(validateURL('not-a-url')).toBe('Invalid URL format');
    expect(validateURL('ftp://example.com')).toBe('URL must start with http:// or https://');
  });
});

// Number validation tests
describe('validateNumber', () => {
  test('should validate correct numbers', () => {
    expect(validateNumber(5, 1, 10, 'Test')).toBeNull();
    expect(validateNumber('5', 1, 10, 'Test')).toBeNull();
  });

  test('should reject invalid numbers', () => {
    expect(validateNumber('abc', 1, 10, 'Test')).toBe('Test must be a valid number');
    expect(validateNumber(15, 1, 10, 'Test')).toBe('Test must not exceed 10');
    expect(validateNumber(0, 1, 10, 'Test')).toBe('Test must be at least 1');
  });
});

// Text validation tests
describe('validateText', () => {
  test('should validate correct text', () => {
    expect(validateText('Hello World', 1, 100, 'Test')).toBeNull();
  });

  test('should reject invalid text', () => {
    expect(validateText('', 1, 100, 'Test')).toBe('Test is required');
    expect(validateText('Hi', 5, 100, 'Test')).toBe('Test must be at least 5 characters');
    expect(validateText('A'.repeat(150), 1, 100, 'Test')).toBe('Test must not exceed 100 characters');
  });
});

// Phone validation tests
describe('validatePhone', () => {
  test('should validate correct phone numbers', () => {
    expect(validatePhone('1234567890')).toBeNull();
    expect(validatePhone('+1 (123) 456-7890')).toBeNull();
    expect(validatePhone('123-456-7890')).toBeNull();
  });

  test('should reject invalid phone numbers', () => {
    expect(validatePhone('123')).toBe('Phone must be at least 10 digits');
    expect(validatePhone('abc1234567')).toBe('Phone number can only contain digits, spaces, dashes, parentheses, and plus signs');
  });
});

// Phone uniqueness validation tests
describe('validatePhoneUnique', () => {
  test('should validate unique phone', () => {
    const existingPhones = ['1234567890', '0987654321'];
    expect(validatePhoneUnique('5555555555', existingPhones)).toBeNull();
  });

  test('should reject duplicate phone', () => {
    const existingPhones = ['1234567890', '0987654321'];
    expect(validatePhoneUnique('1234567890', existingPhones))
      .toBe('Phone number already exists. Please use a different phone number.');
  });

  test('should allow same phone when editing current user', () => {
    const existingPhones = ['1234567890', '0987654321'];
    expect(validatePhoneUnique('1234567890', existingPhones, '1234567890'))
      .toBeNull();
  });

  test('should handle different phone formats', () => {
    const existingPhones = ['123-456-7890'];
    expect(validatePhoneUnique('1234567890', existingPhones))
      .toBe('Phone number already exists. Please use a different phone number.');
    expect(validatePhoneUnique('(123) 456-7890', existingPhones))
      .toBe('Phone number already exists. Please use a different phone number.');
  });
});

// Required validation tests
describe('validateRequired', () => {
  test('should validate required values', () => {
    expect(validateRequired('test', 'Test')).toBeNull();
    expect(validateRequired(true, 'Test')).toBeNull();
    expect(validateRequired(['item'], 'Test')).toBeNull();
    expect(validateRequired({ key: 'value' }, 'Test')).toBeNull();
  });

  test('should reject empty values', () => {
    expect(validateRequired('', 'Test')).toBe('Test is required');
    expect(validateRequired('   ', 'Test')).toBe('Test is required');
    expect(validateRequired(null, 'Test')).toBe('Test is required');
    expect(validateRequired(undefined, 'Test')).toBe('Test is required');
    expect(validateRequired([], 'Test')).toBe('Test is required');
    expect(validateRequired({}, 'Test')).toBe('Test is required');
  });
});

// Username validation tests
describe('validateUsername', () => {
  test('should validate correct usernames', () => {
    expect(validateUsername('username123')).toBeNull();
    expect(validateUsername('user_name')).toBeNull();
    expect(validateUsername('user-name')).toBeNull();
  });

  test('should reject invalid usernames', () => {
    expect(validateUsername('ab')).toBe('Username must be at least 3 characters');
    expect(validateUsername('user@name')).toBe('Username can only contain letters, numbers, underscores, and hyphens');
    expect(validateUsername('_username')).toBe('Username cannot start or end with underscore or hyphen');
    expect(validateUsername('username_')).toBe('Username cannot start or end with underscore or hyphen');
  });
});

// Username uniqueness validation tests
describe('validateUsernameUnique', () => {
  test('should validate unique username', () => {
    const existingUsernames = ['user1', 'user2'];
    expect(validateUsernameUnique('newuser', existingUsernames)).toBeNull();
  });

  test('should reject duplicate username', () => {
    const existingUsernames = ['user1', 'user2'];
    expect(validateUsernameUnique('user1', existingUsernames))
      .toBe('Username already exists. Please choose a different username.');
  });

  test('should allow same username when editing current user', () => {
    const existingUsernames = ['user1', 'user2'];
    expect(validateUsernameUnique('user1', existingUsernames, 'user1'))
      .toBeNull();
  });

  test('should handle case insensitive comparison', () => {
    const existingUsernames = ['User1'];
    expect(validateUsernameUnique('user1', existingUsernames))
      .toBe('Username already exists. Please choose a different username.');
  });
});

// Helper functions tests
describe('Helper functions', () => {
  test('hasErrors should work correctly', () => {
    expect(hasErrors({ field1: null, field2: null })).toBe(false);
    expect(hasErrors({ field1: 'Error', field2: null })).toBe(true);
    expect(hasErrors({ field1: null, field2: 'Error' })).toBe(true);
  });

  test('getFirstError should return first error', () => {
    expect(getFirstError({ field1: null, field2: 'Error2' })).toBe('Error2');
    expect(getFirstError({ field1: 'Error1', field2: 'Error2' })).toBe('Error1');
    expect(getFirstError({ field1: null, field2: null })).toBeNull();
  });

  test('getErrorCount should count errors', () => {
    expect(getErrorCount({ field1: null, field2: null })).toBe(0);
    expect(getErrorCount({ field1: 'Error1', field2: null })).toBe(1);
    expect(getErrorCount({ field1: 'Error1', field2: 'Error2' })).toBe(2);
  });

  test('clearErrors should clear all errors', () => {
    const errors = { field1: 'Error1', field2: 'Error2' };
    const cleared = clearErrors(errors);
    expect(cleared).toEqual({ field1: null, field2: null });
  });
});

