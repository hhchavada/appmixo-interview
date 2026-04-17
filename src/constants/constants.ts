export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    INVALID_CREDENTIALS: 'Invalid email or password',
    TOKEN_REQUIRED: 'Access token is required',
    TOKEN_INVALID: 'Invalid or expired token',
    ACCESS_DENIED: 'Access denied',
  },
  USER: {
    NOT_FOUND: 'User not found',
    EMAIL_EXISTS: 'Email already exists',
    CREATED: 'User created successfully',
    UPDATED: 'User updated successfully',
    DELETED: 'User deleted successfully',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please provide a valid email address',
    INVALID_PASSWORD: 'Password must be at least 6 characters long',
  },
  SERVER: {
    ERROR: 'Internal server error',
    SUCCESS: 'Operation completed successfully',
  },
} as const;
