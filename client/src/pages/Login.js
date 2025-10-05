import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Login = () => {
    const [alert, setAlert] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    // Redirect if already authenticated
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const validationRules = {
        email: {
            required: true,
            email: true,
            messages: {
                required: 'El email es requerido',
                email: 'Ingresa un email válido',
            },
        },
        password: {
            required: true,
            messages: {
                required: 'La contraseña es requerida',
            },
        },
    };

    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
    } = useForm(
        {
            email: '',
            password: '',
        },
        validationRules
    );

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        console.log('Form submitted with values:', values);

        if (!values.email || !values.password) {
            setAlert({
                type: 'error',
                message: 'Por favor completa todos los campos',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            setAlert(null);
            console.log('Attempting login with:', { email: values.email, password: '***' });
            console.log('Actual credentials being sent:', { email: values.email, password: values.password });

            const response = await login({
                email: values.email,
                password: values.password
            });

            console.log('Login response:', response);

            if (response.success) {
                navigate(from, { replace: true });
            } else {
                setAlert({
                    type: 'error',
                    message: response.message || 'Error al iniciar sesión',
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-xl">AC</span>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Inicia sesión en tu cuenta
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        ¿No tienes una cuenta?{' '}
                        <Link
                            to="/register"
                            className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
                        >
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {alert && (
                        <div className="mb-6">
                            <Alert
                                type={alert.type}
                                message={alert.message}
                                onClose={() => setAlert(null)}
                            />
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleFormSubmit}>
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={values.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    onBlur={() => handleBlur('email')}
                                    className={`input-field ${touched.email && errors.email
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                        : ''
                                        }`}
                                    placeholder="tu@email.com"
                                />
                                {touched.email && errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={values.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    onBlur={() => handleBlur('password')}
                                    className={`input-field ${touched.password && errors.password
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                        : ''
                                        }`}
                                    placeholder="••••••••"
                                />
                                {touched.password && errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {isSubmitting ? (
                                    <LoadingSpinner size="sm" message="" />
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Demo accounts info */}
                    <div className="mt-6 border-t border-gray-200 pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-3">Cuentas de demostración:</p>
                            <div className="space-y-2 text-xs text-gray-500">
                                <p>
                                    <strong>Usuario:</strong> usuario@appcontrol.com / User123!
                                </p>
                                <p>
                                    <strong>Editor:</strong> editor@appcontrol.com / Editor123!
                                </p>
                                <p>
                                    <strong>Admin:</strong> admin@appcontrol.com / Admin123!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;