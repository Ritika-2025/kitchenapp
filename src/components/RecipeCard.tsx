import { useState, useEffect } from 'react';
import { Heart, Clock, Users } from 'lucide-react';
import { Meal } from '../types';
import { favoritesService } from '../services/supabase';

interface RecipeCardProps {
  meal: Meal;
  onClick?: () => void;
  showRemove?: boolean;
  onRemove?: () => void;
}

export default function RecipeCard({ meal, onClick, showRemove, onRemove }: RecipeCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, [meal.idMeal]);

  const checkFavorite = async () => {
    const favorite = await favoritesService.isFavorite(meal.idMeal);
    setIsFavorite(favorite);
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);

    if (isFavorite) {
      await favoritesService.removeFavorite(meal.idMeal);
      setIsFavorite(false);
      if (onRemove) onRemove();
    } else {
      await favoritesService.addFavorite(
        meal.idMeal,
        meal.strMeal,
        meal.strMealThumb
      );
      setIsFavorite(true);
    }

    setLoading(false);
  };

  const estimatedTime = Math.floor(Math.random() * 30) + 15;
  const servings = Math.floor(Math.random() * 4) + 2;

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        <button
          onClick={toggleFavorite}
          disabled={loading}
          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors z-10"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-2">
          {meal.strMeal}
        </h3>

        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{estimatedTime} mins</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{servings} servings</span>
          </div>
        </div>

        {meal.strCategory && (
          <div className="mt-3">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              {meal.strCategory}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
