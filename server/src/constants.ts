export const CONSTANTS = {
    APP_NAME: 'Job Agency',
    // HTTP Methods
    HTTP_METHOD: {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE',
        PATCH: 'PATCH',
    },

    // HTTP Status Codes
    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500,
    },

    // Error Messages
    ERROR_MESSAGES: {
        INVALID_CREDENTIALS: 'Invalid credentials provided.',
        UNAUTHORIZED_ACCESS: 'Unauthorized access.',
        RESOURCE_NOT_FOUND: 'Requested resource not found.',
        VALIDATION_ERROR: 'Validation failed.',
        INTERNAL_ERROR: 'An internal server error occurred.',
        RATE_LIMIT_EXCEEDED: 'Rate limit exceeded.',
        EMAIL_EXISTS: 'User already exists',
        INVALID_TOKEN: 'Invalid or expired token.',
        USER_NOT_FOUND: 'User not found.',
        EMAIL_NOT_VERIFIED: 'Please verify your email address before logging in.',
    },

    // Success Messages
    SUCCESS_MESSAGES: {
        CREATED: 'Resource created successfully.',
        UPDATED: 'Resource updated successfully.',
        DELETED: 'Resource deleted successfully.',
        LOGIN_SUCCESS: 'Logged in successfully.',
        REGISTER_SUCCESS: 'Registered successfully. Please check your email to verify your account.',
        VERIFY_SUCCESS: 'Email verified successfully.',
        FORGOT_PASSWORD_SUCCESS: 'Password reset link sent to your email.',
        RESET_PASSWORD_SUCCESS: 'Password reset successfully.',
    },

    // Bank Account Types
    BANK_ACCOUNT_TYPES: {
        OPEN_BENEFICIARY: 'Open Beneficiary',
        NORMAL: 'Normal',
    },

    // Payment Statuses
    PAYMENT_STATUSES: {
        PENDING: 'Pending',
        VERIFIED: 'Verified',
        REJECTED: 'Rejected',
        PAID: 'Paid',
        UNPAID: 'Unpaid',
    },

    // Application Statuses
    APPLICATION_STATUSES: {
        DRAFT: 'Draft',
        ACTIVE: 'Active',
        COMPLETED: 'Completed',
        REJECTED: 'Rejected',
    },

    // Roles
    ROLES: {
        ADMIN: 'ADMIN',
        APPLICANT: 'APPLICANT',
    },

    // Cryptocurrencies
    CRYPTO_TYPES: {
        BTC: 'BTC',
        ETH: 'ETH',
        USDT: 'USDT',
    },

    CRYPTO_NETWORKS: {
        ERC20: 'ERC20',
        TRC20: 'TRC20',
        BEP20: 'BEP20',
    },

    // File Constraints
    FILE_CONSTRAINTS: {
        CV_LIMIT_MB: 5,
        PAYMENT_LIMIT_MB: 10,
        ALLOWED_CV_TYPES: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
    },

    // Default Seeding Values
    SEED_DEFAULTS: {
        HIGH_VALUE_THRESHOLD: 4999, // $4,999 threshold constraint mapping to StRS
    }
};
