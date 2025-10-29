import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Clock, Users, ChefHat, Printer, Share2 } from 'lucide-react';
import { mealDbApi } from '../services/mealdb';
import { favoritesService } from '../services/supabase';
import { MealDetail } from '../types';

interface RecipeDetailProps {
  mealId: string;
  onBack: () => void;
}

export default function RecipeDetail({ mealId, onBack }: RecipeDetailProps) {
  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition'>('ingredients');
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadMeal();
    checkFavorite();
  }, [mealId]);

  const loadMeal = async () => {
    setLoading(true);
    const mealData = await mealDbApi.getMealById(mealId);
    setMeal(mealData);
    setLoading(false);
  };

  const checkFavorite = async () => {
    const favorite = await favoritesService.isFavorite(mealId);
    setIsFavorite(favorite);
  };

  const toggleFavorite = async () => {
    if (!meal) return;

    if (isFavorite) {
      await favoritesService.removeFavorite(mealId);
      setIsFavorite(false);
    } else {
      await favoritesService.addFavorite(
        meal.idMeal,
        meal.strMeal,
        meal.strMealThumb
      );
      setIsFavorite(true);
    }
  };

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const getInstructions = () => {
    if (!meal?.strInstructions) return [];
    return meal.strInstructions
      .split(/\r?\n/)
      .filter(line => line.trim().length > 0)
      .map(line => line.trim());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Recipe not found</p>
          <button
            onClick={onBack}
            className="mt-4 text-green-600 hover:text-green-700 font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const estimatedTime = 15 + Math.floor(meal.ingredients.length * 2);
  const servings = 4;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to recipes</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          <div>
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="w-full h-64 sm:h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
            />
          </div>

          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  {meal.strMeal}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  A delicious {meal.strCategory?.toLowerCase()} recipe from {meal.strArea} cuisine.
                  Perfect for any occasion, this dish combines wonderful flavors and textures.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {meal.strCategory && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {meal.strCategory}
                </span>
              )}
              {meal.strArea && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {meal.strArea}
                </span>
              )}
              {meal.strTags && meal.strTags.split(',').slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <Clock className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-xs text-gray-600">Prep Time</p>
                <p className="text-lg font-bold text-gray-900">15 mins</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <ChefHat className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-xs text-gray-600">Cook Time</p>
                <p className="text-lg font-bold text-gray-900">{estimatedTime} mins</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <Users className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-xs text-gray-600">Servings</p>
                <p className="text-lg font-bold text-gray-900">{servings} People</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <ChefHat className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-xs text-gray-600">Difficulty</p>
                <p className="text-lg font-bold text-gray-900">Easy</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={toggleFavorite}
                className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  isFavorite
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{isFavorite ? 'Saved' : 'Save to Favorites'}</span>
              </button>
              <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Printer className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`flex-1 px-4 sm:px-6 py-4 text-sm sm:text-base font-medium transition-colors ${
                  activeTab === 'ingredients'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Ingredients
              </button>
              <button
                onClick={() => setActiveTab('instructions')}
                className={`flex-1 px-4 sm:px-6 py-4 text-sm sm:text-base font-medium transition-colors ${
                  activeTab === 'instructions'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Instructions
              </button>
              <button
                onClick={() => setActiveTab('nutrition')}
                className={`flex-1 px-4 sm:px-6 py-4 text-sm sm:text-base font-medium transition-colors ${
                  activeTab === 'nutrition'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Nutrition
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === 'ingredients' && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Ingredients & Instructions
                </h2>
                <div className="space-y-3">
                  {meal.ingredients.map((item, index) => (
                    <label
                      key={index}
                      className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={checkedIngredients.has(index)}
                        onChange={() => toggleIngredient(index)}
                        className="w-5 h-5 text-green-600 rounded mt-0.5"
                      />
                      <div className="flex-1">
                        <span className={`text-sm sm:text-base ${
                          checkedIngredients.has(index)
                            ? 'line-through text-gray-400'
                            : 'text-gray-900'
                        }`}>
                          <span className="font-semibold">{item.measure}</span> {item.ingredient}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'instructions' && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Step-by-Step Instructions
                </h2>
                <div className="space-y-4">
                  {getInstructions().map((instruction, index) => (
                    <div key={index} className="flex space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="flex-1 text-sm sm:text-base text-gray-700 leading-relaxed pt-1">
                        {instruction}
                      </p>
                    </div>
                  ))}
                </div>

                {meal.strYoutube && (
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Video Tutorial</h3>
                    <a
                      href={meal.strYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
                    >
                      <span>Watch on YouTube</span>
                      <Share2 className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Nutritional Information
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Estimated values per serving
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Calories</p>
                    <p className="text-2xl font-bold text-gray-900">450</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Protein</p>
                    <p className="text-2xl font-bold text-gray-900">25g</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Carbs</p>
                    <p className="text-2xl font-bold text-gray-900">35g</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Fat</p>
                    <p className="text-2xl font-bold text-gray-900">18g</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  * Nutritional values are estimates and may vary based on specific ingredients used.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
