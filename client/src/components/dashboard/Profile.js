import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import Alert from '../common/Alert';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
        height: '',
        weight: '',
        diabetesType: '',
        diagnosis_date: '',
        currentMedication: '',
        emergencyContact: '',
        emergencyPhone: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                age: user.profile?.age || '',
                height: user.profile?.height || '',
                weight: user.profile?.weight || '',
                diabetesType: user.profile?.diabetesType || '',
                diagnosis_date: user.profile?.diagnosis_date ?
                    new Date(user.profile.diagnosis_date).toISOString().split('T')[0] : '',
                currentMedication: user.profile?.currentMedication || '',
                emergencyContact: user.profile?.emergencyContact || '',
                emergencyPhone: user.profile?.emergencyPhone || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const profileData = {
                name: formData.name,
                profile: {
                    age: parseInt(formData.age) || null,
                    height: parseFloat(formData.height) || null,
                    weight: parseFloat(formData.weight) || null,
                    diabetesType: formData.diabetesType,
                    diagnosis_date: formData.diagnosis_date || null,
                    currentMedication: formData.currentMedication,
                    emergencyContact: formData.emergencyContact,
                    emergencyPhone: formData.emergencyPhone
                }
            };

            const response = await userService.updateProfile(profileData);

            if (response.success) {
                await updateProfile(profileData);
                setSuccess('Perfil actualizado exitosamente');
            } else {
                setError(response.message || 'Error al actualizar el perfil');
            }
        } catch (err) {
            setError('Error al actualizar el perfil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Mi Perfil</h1>

                {error && <Alert type="error" message={error} />}
                {success && <Alert type="success" message={success} />}

                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Información Personal */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Información Personal</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre Completo *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">El email no se puede cambiar</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Edad
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        min="1"
                                        max="120"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Información Médica */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Información Médica</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Altura (cm)
                                    </label>
                                    <input
                                        type="number"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleInputChange}
                                        min="100"
                                        max="250"
                                        step="0.1"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Peso (kg)
                                    </label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        min="30"
                                        max="300"
                                        step="0.1"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipo de Diabetes
                                    </label>
                                    <select
                                        name="diabetesType"
                                        value={formData.diabetesType}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Seleccionar tipo</option>
                                        <option value="Tipo 1">Tipo 1</option>
                                        <option value="Tipo 2">Tipo 2</option>
                                        <option value="Gestacional">Gestacional</option>
                                        <option value="MODY">MODY</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha de Diagnóstico
                                    </label>
                                    <input
                                        type="date"
                                        name="diagnosis_date"
                                        value={formData.diagnosis_date}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Medicación Actual
                                    </label>
                                    <textarea
                                        name="currentMedication"
                                        value={formData.currentMedication}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Describe tu medicación actual..."
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contacto de Emergencia */}
                        <div className="pb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contacto de Emergencia</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del Contacto
                                    </label>
                                    <input
                                        type="text"
                                        name="emergencyContact"
                                        value={formData.emergencyContact}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Teléfono de Emergencia
                                    </label>
                                    <input
                                        type="tel"
                                        name="emergencyPhone"
                                        value={formData.emergencyPhone}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                            >
                                {loading ? 'Actualizando...' : 'Actualizar Perfil'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}; export default Profile;