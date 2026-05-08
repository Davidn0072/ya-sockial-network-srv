import { AppError } from '../errors/AppError.js';

const validateContent = (content, minLength = 3, maxLength = 1000) => {
    if (!content || typeof content !== 'string') {
        throw new AppError("Content is required and must be a string", 400);
    }
    const trimmed = content.trim();
    if (trimmed.length < minLength) {
        throw new AppError(`Content must be at least ${minLength} characters`, 400);
    }
    if (trimmed.length > maxLength) {
        throw new AppError(`Content cannot exceed ${maxLength} characters`, 400);
    }
    return trimmed;
};

export { validateContent };
