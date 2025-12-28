export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',

  NAME_IS_REQUIRED: 'Name is required.',
  NAME_MUST_BE_STRING: 'Name must be a string.',
  NAME_LENGTH: 'Name must be between 1 and 100 characters.',

  EMAIL_IS_REQUIRED: 'Email is required.',
  EMAIL_IS_INVALID: 'Email is not valid.',
  EMAIL_ALREADY_EXISTS: 'Email already existed',

  EMAIL_OR_PASSWORD_INCORRECT: 'Email or password incorrect',

  PASSWORD_IS_REQUIRED: 'Password is required.',
  PASSWORD_LENGTH: 'Password must be between 6 and 50 characters.',
  PASSWORD_STRONG:
    'Password must be at least 6 characters long and include at least 1 lowercase letter, 1 uppercase letter, and 1 symbol.',

  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required.',
  CONFIRM_PASSWORD_NOT_MATCH: 'Confirm password does not match password.',

  DATE_OF_BIRTH_ISO8601: 'Date of birth must be a valid ISO8601 date (e.g., 2000-12-31).',

  USER_NOT_FOUND: 'User not found'
} as const
