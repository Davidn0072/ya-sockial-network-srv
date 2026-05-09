import { AppError } from '../errors/AppError.js';

const normalizeEmail = (email) => {
    if (!email) return '';
    return email.toLowerCase().trim();
};

const validateEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        throw new AppError('Invalid email address', 400);
    }
};

const validateAndNormalizeEmail = (email) => {
    if (!email || typeof email !== 'string') {
        throw new AppError('Email is required and must be a string', 400);
    }
    const normalized = normalizeEmail(email);
    if (!normalized) {
        throw new AppError('Email cannot be empty', 400);
    }
    validateEmail(normalized);
    return normalized;
};

export { normalizeEmail, validateEmail, validateAndNormalizeEmail };
