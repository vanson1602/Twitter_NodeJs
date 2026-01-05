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

  USER_NOT_FOUND: 'User not found',

  ACCESS_TOKEN_IS_INVALID: 'Access token is invalid',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',

  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_STRING: 'Refresh token must be a string',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',

  LOGOUT_SUCCESSFULLY: 'Logout successfully',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verified before',
  EMAIL_VERIFY_SUCCESS: 'Email verify successfully',
  EMAIL_VERIFY_TOKEN_IS_INVALID: 'Email verify token is invalid',
  RESEND_EMAIL_VERIFY_SUCCESS: 'Resend email verify success',
  USER_HAVE_TO_VERIFY_EMAIL: 'User have to verify email before login',

  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password success',
  FORGOT_PASSWORD_TOKEN_IS_INVALID: 'Forgot password token is invalid',
  RESET_PASSWORD_SUCCESS: 'Reset password successfully',

  GET_ME_SUCCESS: 'get my profile success',
  USER_NOT_VERIFIED: 'User not verify',
  UPDATE_ME_SUCCESS: 'Update me successfully',
  GET_PROFILE_USER_SUCCESS: 'Get profile user success',

  FOLLOW_SUCCESS: 'Follow success',
  INVALID_FOLLOWED_USER_ID: 'Invalid follower user_id',
  ALREADY_FOLLOW_USER: 'You already follow this user',
  UN_FOLLOW_SUCCESS: 'Unfollow success',
  HAVE_NOT_FOLLOWED: 'You have not followed this user yet.',
  INVALID_USER_ID: 'Invalid user_id',
  ALREADY_UN_FOLLOW: 'Already un follow user',
  USER_NAME_INVALID:
    'Username must be 4-15 characters long and contain only letters, numbers, underscores and not only numbers',
  USERNAME_EXISTED: 'Username existed',
  OLD_PASSWORD_NOT_MATCH: 'Old password not match',
  CHANGE_PASSWORD_SUCCESS: 'Change password success'
} as const
