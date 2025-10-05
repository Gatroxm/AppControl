import React, { useState, useEffect } from 'react';
import recipeService from '../../services/recipeService';
import Alert from '../common/Alert';
import LoadingSpinner from '../common/LoadingSpinner';

const Recipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    useEffect(() => {
        loadRecipes();
    }, []);

    const loadRecipes = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('Cargando recetas...');
            const response = await recipeService.getRecipes();
            console.log('Respuesta del servicio de recetas:', response);

            if (response.success && response.data && response.data.recipes) {
                console.log('Recetas encontradas:', response.data.recipes.length);
                setRecipes(Array.isArray(response.data.recipes) ? response.data.recipes : []);
            } else {
                console.error('Error en la respuesta:', response);
                setError('Error al cargar recetas');
                setRecipes([]);
            }
        } catch (err) {
            console.error('Error al cargar recetas:', err);
            setError(`Error al cargar recetas: ${err.message}`);
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = recipe.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (recipe.tags && Array.isArray(recipe.tags) && recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
        const matchesCategory = !categoryFilter || recipe.difficulty === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = [...new Set(recipes.map(recipe => recipe.difficulty).filter(Boolean))];

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
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Recetas Saludables</h1>
                <p className="text-gray-600">Descubre deliciosas recetas adaptadas para diabéticos</p>
            </div>

            {error && <Alert type="error" message={error} />}

            {/* Filtros de búsqueda */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Buscar recetas
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por título, descripción o etiquetas..."
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filtrar por dificultad
                        </label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Todas las dificultades</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid de recetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.length === 0 ? (
                    <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron recetas</h3>
                        <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
                    </div>
                ) : (
                    filteredRecipes.map((recipe) => (
                        <div
                            key={recipe._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => setSelectedRecipe(recipe)}
                        >
                            {recipe.imageUrl && (
                                <img
                                    src={recipe.imageUrl}
                                    alt={recipe.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                        {recipe.title}
                                    </h3>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                        {recipe.difficulty || 'Sin dificultad'}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {recipe.description}
                                </p>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center space-x-3">
                                        <span className="flex items-center">
                                            🕒 {recipe.prepTime} min
                                        </span>
                                        <span className="flex items-center">
                                            👥 {recipe.servings}
                                        </span>
                                    </div>
                                </div>

                                {recipe.tags && recipe.tags.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {recipe.tags.slice(0, 3).map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                        {recipe.tags.length > 3 && (
                                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                                +{recipe.tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de receta detallada */}
            {selectedRecipe && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl max-h-screen overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">
                                {selectedRecipe.title}
                            </h2>
                            <button
                                onClick={() => setSelectedRecipe(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6">
                            {selectedRecipe.imageUrl && (
                                <img
                                    src={selectedRecipe.imageUrl}
                                    alt={selectedRecipe.title}
                                    className="w-full h-64 object-cover rounded-lg mb-4"
                                />
                            )}

                            <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                    🕒 {selectedRecipe.prepTime} minutos
                                </span>
                                <span className="flex items-center">
                                    👥 {selectedRecipe.servings} porciones
                                </span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    {selectedRecipe.difficulty || 'Sin dificultad'}
                                </span>
                            </div>

                            <p className="text-gray-700 mb-6">{selectedRecipe.description}</p>

                            {selectedRecipe.tags && selectedRecipe.tags.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 mb-2">Etiquetas:</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedRecipe.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Ingredientes:</h4>
                                    <ul className="space-y-2">
                                        {selectedRecipe.ingredients.map((ingredient, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="text-green-500 mr-2">•</span>
                                                <span className="text-gray-700">{ingredient}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Instrucciones:</h4>
                                    <div className="space-y-3">
                                        {typeof selectedRecipe.instructions === 'string' ? (
                                            // Si instructions es un string, dividirlo por puntos y números
                                            selectedRecipe.instructions.split(/\d+\.\s+/).filter(Boolean).map((instruction, index) => (
                                                <div key={index} className="flex">
                                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center justify-center mr-3">
                                                        {index + 1}
                                                    </span>
                                                    <span className="text-gray-700">{instruction.trim()}</span>
                                                </div>
                                            ))
                                        ) : (
                                            // Si instructions es un array, mapearlo normalmente
                                            Array.isArray(selectedRecipe.instructions) && selectedRecipe.instructions.map((instruction, index) => (
                                                <div key={index} className="flex">
                                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center justify-center mr-3">
                                                        {index + 1}
                                                    </span>
                                                    <span className="text-gray-700">{instruction}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Recipes;