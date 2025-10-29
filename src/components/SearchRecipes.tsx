import { useState, useEffect } from 'react';
import { Search, X, Plus, Ban, Filter, RotateCcw } from 'lucide-react';
import { mealDbApi } from '../services/mealdb';
import { Meal, MoodType } from '../types';
import RecipeCard from './RecipeCard';

interface SearchRecipesProps {
  onSelectMeal: (mealId: string) => void;
  initialMode?: 'ingredients' | 'mood' | 'time';
}

const commonIngredients = [
  'chicken', 'beef', 'pork', 'salmon', 'pasta', 'rice', 'tomato', 'onion',
  'garlic', 'potato', 'carrot', 'mushroom', 'cheese', 'eggs', 'bread'
];

const moods = [
  { id: 'comforting', label: 'Comforting', color: 'bg-orange-100 text-orange-700' },
  { id: 'quick', label: 'Quick & Easy', color: 'bg-green-100 text-green-700' },
  { id: 'healthy', label: 'Healthy', color: 'bg-teal-100 text-teal-700' },
  { id: 'adventurous', label: 'Adventurous', color: 'bg-purple-100 text-purple-700' }
];

export default function SearchRecipes({ onSelectMeal, initialMode }: SearchRecipesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState<string>('');
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeMode, setActiveMode] = useState(initialMode || 'ingredients');

  useEffect(() => {
    if (initialMode) {
      setActiveMode(initialMode);
    }
  }, [initialMode]);

  const addIngredient = (ingredient: string) => {
    if (ingredient && !ingredients.includes(ingredient.toLowerCase())) {
      setIngredients([...ingredients, ingredient.toLowerCase()]);
      setSearchTerm('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const addExcluded = (ingredient: string) => {
    if (ingredient && !excludedIngredients.includes(ingredient.toLowerCase())) {
      setExcludedIngredients([...excludedIngredients, ingredient.toLowerCase()]);
    }
  };

  const toggleMood = (mood: string) => {
    setSelectedMoods(prev =>
      prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
    );
  };

  const toggleDietaryPref = (pref: string) => {
    setDietaryPrefs(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const searchRecipes = async () => {
    if (ingredients.length === 0 && !searchTerm) {
      const randomMeals = await mealDbApi.getRandomMeals(12);
      setRecipes(randomMeals);
      return;
    }

    setLoading(true);
    let allMeals: Meal[] = [];

    if (ingredients.length > 0) {
      const primaryIngredient = ingredients[0];
      const meals = await mealDbApi.searchByIngredient(primaryIngredient);
      allMeals = meals;
    } else if (searchTerm) {
      const meals = await mealDbApi.searchByName(searchTerm);
      allMeals = meals;
    }

    setRecipes(allMeals);
    setLoading(false);
  };

  const resetFilters = () => {
    setIngredients([]);
    setExcludedIngredients([]);
    setSelectedMoods([]);
    setTimeFilter('');
    setDietaryPrefs([]);
    setSearchTerm('');
    setRecipes([]);
  };

  useEffect(() => {
    if (ingredients.length > 0 || searchTerm) {
      const timer = setTimeout(() => {
        searchRecipes();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [ingredients, searchTerm]);

  useEffect(() => {
    if (recipes.length === 0 && ingredients.length === 0) {
      searchRecipes();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            What should I cook today?
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Find the perfect recipe based on what you have, how you feel, and how much time you've got.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Refine Your Search</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Add ingredients
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addIngredient(searchTerm);
                        }
                      }}
                      placeholder="e.g. 'chicken', 'tomatoes', 'rice'..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {commonIngredients.slice(0, 6).map((ing) => (
                      <button
                        key={ing}
                        onClick={() => addIngredient(ing)}
                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                      >
                        + {ing}
                      </button>
                    ))}
                  </div>

                  {ingredients.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-600 mb-2">Ingredients You Have</p>
                      <div className="flex flex-wrap gap-2">
                        {ingredients.map((ing) => (
                          <span
                            key={ing}
                            className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                          >
                            {ing}
                            <button
                              onClick={() => removeIngredient(ing)}
                              className="ml-2 hover:text-green-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t pt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Mood
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((mood) => (
                      <button
                        key={mood.id}
                        onClick={() => toggleMood(mood.id)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          selectedMoods.includes(mood.id)
                            ? mood.color
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {mood.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Cooking Time
                  </label>
                  <div className="space-y-2">
                    {['<15 min', '<30 min', '<1 hour', '1hr+'].map((time) => (
                      <label key={time} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="time"
                          checked={timeFilter === time}
                          onChange={() => setTimeFilter(time)}
                          className="w-4 h-4 text-green-600"
                        />
                        <span className="text-sm text-gray-700">{time}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Dietary Preferences
                  </label>
                  <div className="space-y-2">
                    {['Vegetarian', 'Gluten-Free', 'Dairy-Free'].map((pref) => (
                      <label key={pref} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dietaryPrefs.includes(pref)}
                          onChange={() => toggleDietaryPref(pref)}
                          className="w-4 h-4 text-green-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{pref}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={searchRecipes}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-4 sm:mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by ingredients (e.g., chicken, tomatoes, rice)"
                  className="w-full pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-xl h-56 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {recipes.map((meal) => (
                  <RecipeCard
                    key={meal.idMeal}
                    meal={meal}
                    onClick={() => onSelectMeal(meal.idMeal)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
