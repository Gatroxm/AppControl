import React, { useState, useEffect } from 'react';
import examService from '../../services/examService';
import { useAuth } from '../../context/AuthContext';
import Alert from '../common/Alert';
import LoadingSpinner from '../common/LoadingSpinner';

const MedicalExams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        examDate: '',
        examType: 'Otro'
    });

    const { user } = useAuth();

    useEffect(() => {
        loadExams();
    }, []);

    const loadExams = async () => {
        try {
            setLoading(true);
            console.log('Loading medical exams...');
            const response = await examService.getExams();
            console.log('Exams response:', response);

            if (response.success && response.data && response.data.exams) {
                setExams(response.data.exams);
                console.log('Exams loaded:', response.data.exams.length);
            } else {
                console.log('No exams found or error in response');
                setError('Error al cargar exámenes');
                setExams([]);
            }
        } catch (err) {
            console.error('Error loading exams:', err);
            setError('Error al cargar exámenes');
            setExams([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const examFormData = new FormData();
            examFormData.append('title', formData.title);
            examFormData.append('examDate', formData.examDate);
            examFormData.append('examType', formData.examType);

            if (selectedFile) {
                examFormData.append('examFile', selectedFile);
            }

            const response = await examService.uploadExam(examFormData);

            if (response.success) {
                setShowForm(false);
                setFormData({ title: '', examDate: '', examType: 'Otro' });
                setSelectedFile(null);
                loadExams();
                setError('');
            } else {
                setError(response.message || 'Error al crear examen');
            }
        } catch (err) {
            setError('Error al crear examen');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Exámenes Médicos</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    {showForm ? 'Cancelar' : 'Nuevo Examen'}
                </button>
            </div>

            {error && <Alert type="error" message={error} />}

            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Registrar Nuevo Examen</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Título del Examen
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ej: Hemoglobina Glicosilada - Control Trimestral"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha del Examen
                                </label>
                                <input
                                    type="date"
                                    name="examDate"
                                    value={formData.examDate}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de Examen
                            </label>
                            <select
                                name="examType"
                                value={formData.examType}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Hemoglobina Glicosilada">Hemoglobina Glicosilada</option>
                                <option value="Glucosa en Ayunas">Glucosa en Ayunas</option>
                                <option value="Curva de Tolerancia">Curva de Tolerancia</option>
                                <option value="Microalbúmina">Microalbúmina</option>
                                <option value="Perfil Lipídico">Perfil Lipídico</option>
                                <option value="Función Renal">Función Renal</option>
                                <option value="Fondo de Ojo">Fondo de Ojo</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Archivo (PDF, imagen)
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>



                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Guardar Examen
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-6">
                {exams.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay exámenes registrados</h3>
                        <p className="text-gray-500">Comienza registrando tu primer examen médico</p>
                    </div>
                ) : (
                    exams.map((exam) => (
                        <div key={exam._id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                                    <p className="text-sm text-gray-600">{exam.examType || 'Tipo no especificado'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                        {exam.examDate ? formatDate(exam.examDate) : 'Fecha no especificada'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Subido: {formatDate(exam.uploadDate || exam.createdAt)}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Archivo:</span> {exam.originalName}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Tamaño:</span> {Math.round(exam.fileSize / 1024)} KB
                                </p>
                            </div>

                            {exam.fileUrl && (
                                <div className="flex items-center space-x-2">
                                    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                    <a
                                        href={exam.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Ver archivo adjunto
                                    </a>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MedicalExams;