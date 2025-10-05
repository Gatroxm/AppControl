import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Control tu</span>{' '}
                                    <span className="block text-primary-600 xl:inline">diabetes</span>{' '}
                                    <span className="block xl:inline">de manera inteligente</span>
                                </h1>

                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    AppControl es tu compañero digital para el monitoreo y control de la diabetes.
                                    Registra tus niveles de glucosa, gestiona tus exámenes médicos y descubre
                                    recetas saludables diseñadas especialmente para ti.
                                </p>

                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        {isAuthenticated ? (
                                            <Link
                                                to="/dashboard"
                                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                                            >
                                                Ir al Dashboard
                                            </Link>
                                        ) : (
                                            <Link
                                                to="/register"
                                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                                            >
                                                Comenzar Ahora
                                            </Link>
                                        )}
                                    </div>

                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <Link
                                            to="/recipes"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                                        >
                                            Ver Recetas
                                        </Link>
                                    </div>
                                </div>

                                {isAuthenticated && (
                                    <div className="mt-4 text-center lg:text-left">
                                        <p className="text-sm text-gray-600">
                                            Bienvenido de nuevo, <span className="font-medium text-primary-600">{user?.username}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>

                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <div className="h-56 w-full bg-gradient-to-r from-primary-400 to-primary-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
                        <div className="text-center text-white">
                            <div className="text-6xl mb-4">🩺</div>
                            <h3 className="text-2xl font-bold">Tu salud, nuestro compromiso</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
                            Características
                        </h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Todo lo que necesitas para controlar tu diabetes
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            Una plataforma completa diseñada para hacer tu vida más fácil y saludable.
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            {/* Feature 1 */}
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                                    📊
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                                    Registro de Glucosa
                                </p>
                                <p className="mt-2 ml-16 text-base text-gray-500">
                                    Registra y monitorea tus niveles de glucosa con gráficos y estadísticas detalladas.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                                    📋
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                                    Gestión de Exámenes
                                </p>
                                <p className="mt-2 ml-16 text-base text-gray-500">
                                    Almacena y organiza todos tus exámenes médicos de forma segura y accesible.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                                    🍽️
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                                    Recetas Saludables
                                </p>
                                <p className="mt-2 ml-16 text-base text-gray-500">
                                    Descubre recetas especialmente diseñadas para personas con diabetes.
                                </p>
                            </div>

                            {/* Feature 4 */}
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                                    📱
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                                    Acceso Multiplataforma
                                </p>
                                <p className="mt-2 ml-16 text-base text-gray-500">
                                    Accede desde cualquier dispositivo, en cualquier momento y lugar.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            {!isAuthenticated && (
                <div className="bg-primary-800">
                    <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            <span className="block">¿Listo para empezar?</span>
                            <span className="block">Regístrate hoy mismo.</span>
                        </h2>
                        <p className="mt-4 text-lg leading-6 text-primary-200">
                            Únete a miles de personas que ya controlan su diabetes de manera inteligente.
                        </p>
                        <Link
                            to="/register"
                            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto transition-colors duration-200"
                        >
                            Crear Cuenta Gratuita
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;