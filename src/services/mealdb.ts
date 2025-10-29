import { Meal, MealDetail } from '../types';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const mealDbApi = {
  async searchByIngredient(ingredient: string): Promise<Meal[]> {
    try {
      const response = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('Error fetching meals by ingredient:', error);
      return [];
    }
  },

  async getMealById(id: string): Promise<MealDetail | null> {
    try {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      const data = await response.json();

      if (!data.meals || data.meals.length === 0) return null;

      const meal = data.meals[0];
      const ingredients = [];

      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim()) {
          ingredients.push({
            ingredient: ingredient.trim(),
            measure: measure?.trim() || ''
          });
        }
      }

      return {
        ...meal,
        ingredients
      };
    } catch (error) {
      console.error('Error fetching meal details:', error);
      return null;
    }
  },

  async searchByName(name: string): Promise<Meal[]> {
    try {
      const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('Error searching meals by name:', error);
      return [];
    }
  },

  async getRandomMeals(count: number = 10): Promise<Meal[]> {
    try {
      const meals: Meal[] = [];
      const promises = Array(count).fill(null).map(() =>
        fetch(`${BASE_URL}/random.php`).then(res => res.json())
      );

      const results = await Promise.all(promises);
      results.forEach(data => {
        if (data.meals && data.meals[0]) {
          meals.push(data.meals[0]);
        }
      });

      return meals;
    } catch (error) {
      console.error('Error fetching random meals:', error);
      return [];
    }
  }
};
