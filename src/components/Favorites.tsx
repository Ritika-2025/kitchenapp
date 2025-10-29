import { useState, useEffect } from 'react';
import { Heart, Search, Filter } from 'lucide-react';
import { favoritesService } from '../services/supabase';
import { mealDbApi } from '../services/mealdb';
import { Favorite, Meal } from '../types';
import RecipeCard from './RecipeCard';

interface FavoritesProps {
  onSelectMeal: (mealId: string) => void;
}

export default function Favorites({ onSelectMeal }: FavoritesProps) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    const favs = await favoritesService.getFavorites();
    setFavorites(favs);

    const mealPromises = favs.map(fav =>
      mealDbApi.getMealById(fav.meal_id)
    );
    const mealDetails = await Promise.all(mealPromises);

    const validMeals = mealDetails.filter(meal => meal !== null) as Meal[];
    setMeals(validMeals);
    setLoading(false);
  };

  const handleRemove = () => {
    loadFavorites();
  };

  const filteredMeals = meals.filter(meal =>
    meal.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              My Favorite Recipes
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Your saved recipes, all in one place
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search my favorites..."
                className="w-full pl-12 pr-4 py-3 text-sm sm:text-base rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl h-56 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredMeals.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                {filteredMeals.length} {filteredMeals.length === 1 ? 'recipe' : 'recipes'}
              </p>
              <div className="flex items-center space-x-2">
                <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>Sort by: Newest</option>
                  <option>Sort by: Oldest</option>
                  <option>Sort by: Name (A-Z)</option>
                  <option>Sort by: Name (Z-A)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredMeals.map((meal) => (
                <RecipeCard
                  key={meal.idMeal}
                  meal={meal}
                  onClick={() => onSelectMeal(meal.idMeal)}
                  showRemove
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="bg-gray-100 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              No favorites yet
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
              Start exploring recipes and save your favorites by clicking the heart icon
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Discover Recipes
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No recipes found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
