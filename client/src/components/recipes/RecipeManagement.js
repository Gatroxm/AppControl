import React, { useState, useEffect } from 'react';
import recipeService from '../../services/recipeService';
import { useAuth } from '../../context/AuthContext';
import Alert from '../common/Alert';
import LoadingSpinner from '../common/LoadingSpinner';

const RecipeManagement = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ingredients: [''],
        instructions: '',
        prepTime: '',
        servings: '',
        difficulty: 'Fácil',
        tags: ''
    });



    useEffect(() => {
        loadRecipes();
    }, []);

    const loadRecipes = async () => {
        try {
            setLoading(true);
            console.log('Loading user recipes...');
            const response = await recipeService.getMyRecipes();
            console.log('Recipes response:', response);

            if (response.success && response.data && response.data.recipes) {
                setRecipes(response.data.recipes);
                console.log('Recipes loaded:', response.data.recipes.length);
            } else {
                console.log('No recipes found or error in response');
                setError('Error al cargar recetas');
                setRecipes([]);
            }
        } catch (err) {
            console.error('Error loading recipes:', err);
            setError('Error al cargar recetas');
            setRecipes([]);
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

    const handleArrayInputChange = (index, field, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({
            ...formData,
            [field]: newArray
        });
    };

    const addArrayItem = (field) => {
        setFormData({
            ...formData,
            [field]: [...formData[field], '']
        });
    };

    const removeArrayItem = (index, field) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData({
            ...formData,
            [field]: newArray
        });
    };

    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            ingredients: [''],
            instructions: '',
            prepTime: '',
            servings: '',
            difficulty: 'Fácil',
            tags: ''
        });
        setSelectedImage(null);
        setEditingRecipe(null);
        setShowForm(false);
    };

    const viewRecipeDetail = (recipe) => {
        setSelectedRecipe(recipe);
    };

    const closeRecipeDetail = () => {
        setSelectedRecipe(null);
    };

    const handleEdit = (recipe) => {
        setFormData({
            title: recipe.title,
            description: recipe.description,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            prepTime: recipe.prepTime.toString(),
            servings: recipe.servings.toString(),
            difficulty: recipe.difficulty || 'Fácil',
            tags: recipe.tags.join(', ')
        });
        setEditingRecipe(recipe);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const recipeFormData = new FormData();
            recipeFormData.append('title', formData.title);
            recipeFormData.append('description', formData.description);
            recipeFormData.append('ingredients', JSON.stringify(formData.ingredients.filter(i => i.trim())));
            recipeFormData.append('instructions', formData.instructions);
            recipeFormData.append('prepTime', formData.prepTime);
            recipeFormData.append('servings', formData.servings);
            recipeFormData.append('difficulty', formData.difficulty);
            recipeFormData.append('tags', formData.tags.split(',').map(t => t.trim()).filter(t => t).join(','));

            if (selectedImage) {
                recipeFormData.append('image', selectedImage);
            }

            let response;
            if (editingRecipe) {
                response = await recipeService.updateRecipe(editingRecipe._id, recipeFormData);
            } else {
                response = await recipeService.createRecipe(recipeFormData);
            }

            if (response.success) {
                setSuccess(editingRecipe ? 'Receta actualizada exitosamente' : 'Receta creada exitosamente');
                resetForm();
                loadRecipes();
                setError('');
            } else {
                setError(response.message || 'Error al guardar receta');
            }
        } catch (err) {
            setError('Error al guardar receta');
        }
    };

    const handleDelete = async (recipeId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta receta?')) return;

        try {
            const response = await recipeService.deleteRecipe(recipeId);
            if (response.success) {
                setSuccess('Receta eliminada exitosamente');
                loadRecipes();
                setError('');
            } else {
                setError('Error al eliminar receta');
            }
        } catch (err) {
            setError('Error al eliminar receta');
        }
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
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Recetas</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    {showForm ? 'Cancelar' : 'Nueva Receta'}
                </button>
            </div>

            {error && <Alert type="error" message={error} />}
            {success && <Alert type="success" message={success} />}

            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingRecipe ? 'Editar Receta' : 'Nueva Receta'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Título de la Receta
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ej: Ensalada de quinoa con vegetales"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tiempo de Preparación (minutos)
                                </label>
                                <input
                                    type="number"
                                    name="prepTime"
                                    value={formData.prepTime}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="30"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Porciones
                                </label>
                                <input
                                    type="number"
                                    name="servings"
                                    value={formData.servings}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="4"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dificultad
                                </label>
                                <select
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="Fácil">Fácil</option>
                                    <option value="Intermedio">Intermedio</option>
                                    <option value="Difícil">Difícil</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Etiquetas (separadas por comas)
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    placeholder="bajo en sodio, sin gluten, vegetariano"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows="3"
                                placeholder="Describe brevemente la receta..."
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ingredientes
                            </label>
                            {formData.ingredients.map((ingredient, index) => (
                                <div key={index} className="flex mb-2">
                                    <input
                                        type="text"
                                        value={ingredient}
                                        onChange={(e) => handleArrayInputChange(index, 'ingredients', e.target.value)}
                                        placeholder="Ej: 1 taza de quinoa"
                                        className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-green-500 focus:border-green-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem(index, 'ingredients')}
                                        className="px-3 py-2 bg-red-500 text-white rounded-r-md hover:bg-red-600"
                                    >
                                        -
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('ingredients')}
                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                                + Agregar ingrediente
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Instrucciones
                            </label>
                            <textarea
                                name="instructions"
                                value={formData.instructions}
                                onChange={handleInputChange}
                                required
                                rows="6"
                                placeholder="Describe paso a paso cómo preparar la receta..."
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Imagen de la Receta
                            </label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept=".jpg,.jpeg,.png"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                                {editingRecipe ? 'Actualizar' : 'Crear'} Receta
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lista de recetas */}
            <div className="grid gap-6">
                {recipes.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recetas</h3>
                        <p className="text-gray-500">Comienza creando tu primera receta</p>
                    </div>
                ) : (
                    recipes.map((recipe) => (
                        <div key={recipe._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                                        <p className="text-gray-600 mb-2">{recipe.description}</p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span>🕒 {recipe.prepTime} min</span>
                                            <span>👥 {recipe.servings} porciones</span>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                {recipe.difficulty || 'Fácil'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => viewRecipeDetail(recipe)}
                                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                                            title="Ver detalles"
                                        >
                                            Ver Detalle
                                        </button>
                                        <button
                                            onClick={() => handleEdit(recipe)}
                                            className="text-blue-600 hover:text-blue-800 p-2"
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(recipe._id)}
                                            className="text-red-600 hover:text-red-800 p-2"
                                            title="Eliminar"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                {recipe.tags && recipe.tags.length > 0 && (
                                    <div className="mb-3">
                                        <div className="flex flex-wrap gap-1">
                                            {recipe.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Ingredientes:</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                                                <li key={index}>• {ingredient}</li>
                                            ))}
                                            {recipe.ingredients.length > 3 && (
                                                <li className="text-gray-500 italic">
                                                    ... y {recipe.ingredients.length - 3} más
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Instrucciones:</h4>
                                        <p className="text-sm text-gray-600">
                                            {recipe.instructions && recipe.instructions.length > 100
                                                ? recipe.instructions.substring(0, 100) + '...'
                                                : recipe.instructions || 'Sin instrucciones'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de Detalle de Receta */}
            {selectedRecipe && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">{selectedRecipe.title}</h2>
                                <button
                                    onClick={closeRecipeDetail}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            {selectedRecipe.description && (
                                <p className="text-gray-600 mb-4 italic">{selectedRecipe.description}</p>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                                <div className="text-center">
                                    <div className="text-xl font-bold text-blue-600">{selectedRecipe.prepTime}</div>
                                    <div className="text-sm text-gray-600">minutos</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-blue-600">{selectedRecipe.servings}</div>
                                    <div className="text-sm text-gray-600">porciones</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-medium text-blue-600">{selectedRecipe.difficulty}</div>
                                    <div className="text-sm text-gray-600">dificultad</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-medium text-blue-600">{selectedRecipe.tags?.length || 0}</div>
                                    <div className="text-sm text-gray-600">etiquetas</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-green-700">📋 Ingredientes</h3>
                                    <ul className="space-y-2">
                                        {selectedRecipe.ingredients.map((ingredient, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="text-green-600 mr-2">•</span>
                                                <span className="text-gray-700">{ingredient}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-orange-700">👨‍🍳 Instrucciones</h3>
                                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {selectedRecipe.instructions || 'Sin instrucciones disponibles'}
                                    </div>
                                </div>
                            </div>

                            {selectedRecipe.tags && selectedRecipe.tags.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold mb-3">🏷️ Etiquetas</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRecipe.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={closeRecipeDetail}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeManagement;