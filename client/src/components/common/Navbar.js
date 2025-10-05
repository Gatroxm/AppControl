import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout, isAuthenticated, hasRole, hasAnyRole } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleMobile = () => setIsOpen(!isOpen);
    const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, children, onClick }) => (
        <Link
            to={to}
            onClick={onClick}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive(to)
                ? 'bg-primary-700 text-white'
                : 'text-primary-100 hover:bg-primary-600 hover:text-white'
                }`}
        >
            {children}
        </Link>
    );

    const MobileNavLink = ({ to, children, onClick }) => (
        <Link
            to={to}
            onClick={onClick}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive(to)
                ? 'bg-primary-700 text-white'
                : 'text-primary-100 hover:bg-primary-600 hover:text-white'
                }`}
        >
            {children}
        </Link>
    );

    return (
        <nav className="bg-primary-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-primary-800 font-bold text-lg">AC</span>
                            </div>
                            <span className="ml-2 text-white font-bold text-xl">AppControl</span>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    {isAuthenticated && (
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            <NavLink to="/dashboard">Dashboard</NavLink>

                            {hasAnyRole(['user', 'editor', 'admin']) && (
                                <>
                                    <NavLink to="/glucometry/records">Glucosa</NavLink>
                                    <NavLink to="/exams">Exámenes</NavLink>
                                </>
                            )}

                            <NavLink to="/recipes">Recetas</NavLink>

                            {hasAnyRole(['editor', 'admin']) && (
                                <NavLink to="/recipes/manage">Mis Recetas</NavLink>
                            )}

                            {hasRole('admin') && (
                                <NavLink to="/admin">Administración</NavLink>
                            )}

                            {/* Profile dropdown */}
                            <div className="relative">
                                <button
                                    onClick={toggleProfile}
                                    className="flex items-center space-x-2 text-primary-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-800 rounded-md p-2"
                                >
                                    <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-medium text-sm">
                                            {user?.username?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium">{user?.username}</span>
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <div className="px-4 py-2 border-b border-gray-200">
                                            <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                            <p className="text-xs text-primary-600 font-medium">{user?.role}</p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Mi Perfil
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                handleLogout();
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Auth buttons for non-authenticated users */}
                    {!isAuthenticated && (
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            <NavLink to="/recipes">Recetas</NavLink>
                            <NavLink to="/login">Iniciar Sesión</NavLink>
                            <Link
                                to="/register"
                                className="bg-white text-primary-800 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                                Registrarse
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMobile}
                            className="text-primary-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-800 rounded-md p-2"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary-700">
                        {isAuthenticated ? (
                            <>
                                <MobileNavLink to="/dashboard" onClick={() => setIsOpen(false)}>
                                    Dashboard
                                </MobileNavLink>

                                {hasAnyRole(['user', 'editor', 'admin']) && (
                                    <>
                                        <MobileNavLink to="/glucometry/records" onClick={() => setIsOpen(false)}>
                                            Glucosa
                                        </MobileNavLink>
                                        <MobileNavLink to="/exams" onClick={() => setIsOpen(false)}>
                                            Exámenes
                                        </MobileNavLink>
                                    </>
                                )}

                                <MobileNavLink to="/recipes" onClick={() => setIsOpen(false)}>
                                    Recetas
                                </MobileNavLink>

                                {hasAnyRole(['editor', 'admin']) && (
                                    <MobileNavLink to="/recipes/manage" onClick={() => setIsOpen(false)}>
                                        Mis Recetas
                                    </MobileNavLink>
                                )}

                                {hasRole('admin') && (
                                    <MobileNavLink to="/admin" onClick={() => setIsOpen(false)}>
                                        Administración
                                    </MobileNavLink>
                                )}

                                <div className="border-t border-primary-600 pt-4 mt-4">
                                    <div className="px-3 py-2">
                                        <p className="text-primary-100 font-medium">{user?.username}</p>
                                        <p className="text-primary-200 text-sm">{user?.email}</p>
                                        <p className="text-primary-300 text-xs">{user?.role}</p>
                                    </div>
                                    <MobileNavLink to="/profile" onClick={() => setIsOpen(false)}>
                                        Mi Perfil
                                    </MobileNavLink>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            handleLogout();
                                        }}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-primary-100 hover:bg-primary-600 hover:text-white"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <MobileNavLink to="/recipes" onClick={() => setIsOpen(false)}>
                                    Recetas
                                </MobileNavLink>
                                <MobileNavLink to="/login" onClick={() => setIsOpen(false)}>
                                    Iniciar Sesión
                                </MobileNavLink>
                                <MobileNavLink to="/register" onClick={() => setIsOpen(false)}>
                                    Registrarse
                                </MobileNavLink>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;