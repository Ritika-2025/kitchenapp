import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const favoritesService = {
  async getFavorites() {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }

    return data || [];
  },

  async addFavorite(mealId: string, mealName: string, mealThumb: string) {
    const { data, error } = await supabase
      .from('favorites')
      .insert([
        {
          meal_id: mealId,
          meal_name: mealName,
          meal_thumb: mealThumb
        }
      ])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error adding favorite:', error);
      return null;
    }

    return data;
  },

  async removeFavorite(mealId: string) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('meal_id', mealId);

    if (error) {
      console.error('Error removing favorite:', error);
      return false;
    }

    return true;
  },

  async isFavorite(mealId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('meal_id', mealId)
      .maybeSingle();

    if (error) {
      console.error('Error checking favorite:', error);
      return false;
    }

    return !!data;
  }
};
