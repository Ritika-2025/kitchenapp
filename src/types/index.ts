export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strTags?: string;
  strYoutube?: string;
  [key: string]: string | undefined;
}

export interface MealDetail extends Meal {
  ingredients: Array<{
    ingredient: string;
    measure: string;
  }>;
}

export interface Favorite {
  id: string;
  meal_id: string;
  meal_name: string;
  meal_thumb: string;
  created_at: string;
}

export type MoodType = 'comforting' | 'quick' | 'healthy' | 'adventurous';
export type CookingTime = '<15' | '<30' | '<1hr' | '1hr+';
export type DietaryPreference = 'vegetarian' | 'gluten-free' | 'dairy-free';
