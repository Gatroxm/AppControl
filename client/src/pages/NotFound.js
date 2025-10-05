import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-primary-600">404</h1>
                <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
                    Página no encontrada
                </h2>
                <p className="mt-2 text-lg text-gray-500">
                    Lo sentimos, la página que buscas no existe.
                </p>
                <div className="mt-8">
                    <Link
                        to="/"
                        className="btn-primary"
                    >
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;