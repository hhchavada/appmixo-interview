export const VALIDATION_MESSAGES = {
  BOOK: {
    TITLE_REQUIRED: 'Book title is required',
    AUTHOR_REQUIRED: 'Book author is required',
    AVAILABLE_COPIES_REQUIRED: 'Available copies is required',
    AVAILABLE_COPIES_MIN: 'Available copies cannot be negative',
  },
  MEMBER: {
    NAME_REQUIRED: 'Member name is required',
    EMAIL_REQUIRED: 'Member email is required',
  },
  TRANSACTION: {
    MEMBER_ID_REQUIRED: 'Member ID is required',
    BOOK_ID_REQUIRED: 'Book ID is required',
  },
  USER: {
    NAME_REQUIRED: 'Name is required',
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Please provide a valid email address',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN: 'Password must be at least 6 characters long',
  },
} as const;

