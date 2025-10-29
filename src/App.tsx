import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SearchRecipes from './components/SearchRecipes';
import RecipeDetail from './components/RecipeDetail';
import Favorites from './components/Favorites';

type Page = 'home' | 'search' | 'favorites' | 'detail';

interface AppState {
  page: Page;
  selectedMealId: string | null;
  searchParams?: any;
}

function App() {
  const [state, setState] = useState<AppState>({
    page: 'home',
    selectedMealId: null
  });

  const navigate = (page: Page, params?: any) => {
    setState({
      page,
      selectedMealId: null,
      searchParams: params
    });
  };

  const handleSelectMeal = (mealId: string) => {
    setState(prev => ({
      ...prev,
      page: 'detail',
      selectedMealId: mealId
    }));
  };

  const handleBack = () => {
    setState(prev => ({
      ...prev,
      page: prev.page === 'detail' ? 'search' : 'home',
      selectedMealId: null
    }));
  };

  const renderContent = () => {
    switch (state.page) {
      case 'home':
        return <Dashboard onNavigate={navigate} />;
      case 'search':
        return (
          <SearchRecipes
            onSelectMeal={handleSelectMeal}
            initialMode={state.searchParams?.mode}
          />
        );
      case 'favorites':
        return <Favorites onSelectMeal={handleSelectMeal} />;
      case 'detail':
        return state.selectedMealId ? (
          <RecipeDetail mealId={state.selectedMealId} onBack={handleBack} />
        ) : null;
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  if (state.page === 'detail') {
    return renderContent();
  }

  return (
    <Layout
      currentPage={state.page}
      onNavigate={(page) => navigate(page)}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
