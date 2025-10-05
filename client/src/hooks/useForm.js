import { useState, useCallback } from 'react';
import { validateForm } from '../utils/validation';

export const useForm = (initialValues = {}, validationRules = {}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback((name, value) => {
        setValues(prev => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    }, [errors]);

    const handleBlur = useCallback((name) => {
        setTouched(prev => ({
            ...prev,
            [name]: true,
        }));

        // Validate single field on blur
        if (validationRules[name]) {
            const fieldValidation = validateForm(
                { [name]: values[name] },
                { [name]: validationRules[name] }
            );

            if (!fieldValidation.isValid) {
                setErrors(prev => ({
                    ...prev,
                    [name]: fieldValidation.errors[name],
                }));
            }
        }
    }, [values, validationRules]);

    const validate = useCallback(() => {
        const validation = validateForm(values, validationRules);
        setErrors(validation.errors);
        return validation.isValid;
    }, [values, validationRules]);

    const handleSubmit = useCallback(async (onSubmit) => {
        setIsSubmitting(true);

        try {
            const isValid = validate();

            if (isValid) {
                await onSubmit(values);
            }

            return isValid;
        } catch (error) {
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }, [values, validate]);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);

    const setFieldValue = useCallback((name, value) => {
        handleChange(name, value);
    }, [handleChange]);

    const setFieldError = useCallback((name, error) => {
        setErrors(prev => ({
            ...prev,
            [name]: error,
        }));
    }, []);

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        validate,
        reset,
        setFieldValue,
        setFieldError,
    };
};