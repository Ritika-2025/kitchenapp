import { ChefHat, Home, Heart, Search } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: 'home' | 'search' | 'favorites';
  onNavigate: (page: 'home' | 'search' | 'favorites') => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <ChefHat className="w-8 h-8 text-green-600" strokeWidth={2} />
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                Taylor's Kitchen Assistant
              </h1>
              <h1 className="text-xl font-bold text-gray-900 sm:hidden">
                Taylor's Kitchen
              </h1>
            </div>

            <nav className="flex items-center space-x-1 sm:space-x-4">
              <button
                onClick={() => onNavigate('home')}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'home'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </button>

              <button
                onClick={() => onNavigate('search')}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'search'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Recipes</span>
              </button>

              <button
                onClick={() => onNavigate('favorites')}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'favorites'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span className="hidden sm:inline">Favorites</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
