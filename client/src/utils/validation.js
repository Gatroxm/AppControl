// Validate email format
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const score = [minLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;

    return {
        isValid: score >= 3 && minLength,
        score,
        requirements: {
            minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasSpecialChar,
        },
        strength: score <= 2 ? 'weak' : score <= 3 ? 'medium' : score <= 4 ? 'strong' : 'very-strong',
    };
};

// Validate username format
export const isValidUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    return usernameRegex.test(username);
};

// Validate glucose reading
export const isValidGlucoseReading = (reading) => {
    const num = parseFloat(reading);
    return !isNaN(num) && num >= 20 && num <= 600;
};

// Validate required field
export const isRequired = (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
};

// Validate string length
export const isValidLength = (value, min = 0, max = Infinity) => {
    if (!value) return min === 0;
    const length = value.toString().length;
    return length >= min && length <= max;
};

// Validate number range
export const isInRange = (value, min = -Infinity, max = Infinity) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
};

// General form validation
export const validateForm = (values, rules) => {
    const errors = {};

    Object.keys(rules).forEach(field => {
        const value = values[field];
        const fieldRules = rules[field];

        // Required validation
        if (fieldRules.required && !isRequired(value)) {
            errors[field] = fieldRules.messages?.required || `${field} es requerido`;
            return;
        }

        // Skip other validations if field is empty and not required
        if (!isRequired(value) && !fieldRules.required) {
            return;
        }

        // Email validation
        if (fieldRules.email && !isValidEmail(value)) {
            errors[field] = fieldRules.messages?.email || 'Formato de email inválido';
            return;
        }

        // Password validation
        if (fieldRules.password) {
            const passwordValidation = validatePassword(value);
            if (!passwordValidation.isValid) {
                errors[field] = fieldRules.messages?.password || 'La contraseña debe tener al menos 6 caracteres con mayúsculas, minúsculas y números';
                return;
            }
        }

        // Username validation
        if (fieldRules.username && !isValidUsername(value)) {
            errors[field] = fieldRules.messages?.username || 'El nombre de usuario debe tener entre 3-30 caracteres y solo contener letras, números, _ y -';
            return;
        }

        // Length validation
        if (fieldRules.minLength || fieldRules.maxLength) {
            if (!isValidLength(value, fieldRules.minLength, fieldRules.maxLength)) {
                errors[field] = fieldRules.messages?.length || `Debe tener entre ${fieldRules.minLength || 0} y ${fieldRules.maxLength || 'infinitos'} caracteres`;
                return;
            }
        }

        // Range validation
        if (fieldRules.min !== undefined || fieldRules.max !== undefined) {
            if (!isInRange(value, fieldRules.min, fieldRules.max)) {
                errors[field] = fieldRules.messages?.range || `Debe estar entre ${fieldRules.min || '-∞'} y ${fieldRules.max || '∞'}`;
                return;
            }
        }

        // Custom validation
        if (fieldRules.custom && typeof fieldRules.custom === 'function') {
            const customError = fieldRules.custom(value, values);
            if (customError) {
                errors[field] = customError;
                return;
            }
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};