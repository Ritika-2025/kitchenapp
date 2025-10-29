import { Clock, Smile, ChefHat, Heart, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { mealDbApi } from '../services/mealdb';
import { Meal } from '../types';
import RecipeCard from './RecipeCard';

interface DashboardProps {
  onNavigate: (page: 'search', params?: any) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [suggestions, setSuggestions] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    setLoading(true);
    const meals = await mealDbApi.getRandomMeals(4);
    setSuggestions(meals);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
          What are we cooking today, Taylor?
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Let's find the perfect recipe for you
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for recipes, ingredients..."
            className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
            onClick={() => onNavigate('search')}
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
        <button
          onClick={() => onNavigate('search', { mode: 'ingredients' })}
          className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-48 sm:h-56"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-teal-500"></div>
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative h-full flex flex-col items-center justify-center text-white p-6">
            <ChefHat className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4" strokeWidth={1.5} />
            <h3 className="text-xl sm:text-2xl font-bold mb-2">What's in My Kitchen?</h3>
            <p className="text-xs sm:text-sm text-center opacity-90">
              Find recipes with ingredients you have
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('search', { mode: 'mood' })}
          className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-48 sm:h-56"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-pink-500"></div>
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative h-full flex flex-col items-center justify-center text-white p-6">
            <Smile className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4" strokeWidth={1.5} />
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Cook by Mood</h3>
            <p className="text-xs sm:text-sm text-center opacity-90">
              Let your feelings guide your meal
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('search', { mode: 'time' })}
          className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-48 sm:h-56 sm:col-span-2 lg:col-span-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500"></div>
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative h-full flex flex-col items-center justify-center text-white p-6">
            <Clock className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4" strokeWidth={1.5} />
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Time-Based Cooking</h3>
            <p className="text-xs sm:text-sm text-center opacity-90">
              Quick meals or slow-cooked delights
            </p>
          </div>
        </button>
      </div>

      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Tonight's Suggestions</h2>
          <button
            onClick={loadSuggestions}
            className="text-sm sm:text-base text-green-600 hover:text-green-700 font-medium"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl h-48 sm:h-64 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {suggestions.map((meal) => (
              <RecipeCard key={meal.idMeal} meal={meal} />
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 sm:p-8 text-center">
        <Heart className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-green-600" />
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">My Favorites</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          Save recipes you love and access them anytime
        </p>
        <button
          onClick={() => onNavigate('favorites' as any)}
          className="bg-green-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base font-medium"
        >
          View My Favorites
        </button>
      </div>
    </div>
  );
}
