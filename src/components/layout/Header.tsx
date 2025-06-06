import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { ShoppingCart, User, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, logout, weather } = useStore();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const getNavLinks = () => {
    if (!currentUser) return null;
    
    switch (currentUser.role) {
      case 'client':
        return (
          <>
            <Link to="/client/menu" className="text-white hover:text-gray-200 mx-3">
              Меню
            </Link>
            <Link to="/client/orders" className="text-white hover:text-gray-200 mx-3">
              Мои заказы
            </Link>
          </>
        );
      
      case 'courier':
        return (
          <>
            <Link to="/courier/dashboard" className="text-white hover:text-gray-200 mx-3">
              Текущие заказы
            </Link>
            <Link to="/courier/history" className="text-white hover:text-gray-200 mx-3">
              История доставок
            </Link>
          </>
        );
      
      case 'admin':
        return (
          <>
            <Link to="/admin/dashboard" className="text-white hover:text-gray-200 mx-3">
              Панель управления
            </Link>
            <Link to="/admin/orders" className="text-white hover:text-gray-200 mx-3">
              Контроль заказов
            </Link>
            <Link to="/admin/couriers" className="text-white hover:text-gray-200 mx-3">
              Все курьеры
            </Link>
          </>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <header className={`bg-indigo-600 ${weather?.condition === 'bad' ? 'bg-gray-600' : ''} shadow-md`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold">
              ЭкспрессДоставка
            </Link>

            <nav className="hidden md:flex ml-6">
              {getNavLinks()}
            </nav>
          </div>
          
          <div className="flex items-center">
            {currentUser ? (
              <>
                <span className="text-white mr-4 hidden md:inline">
                  {currentUser.name}
                </span>
                {currentUser.role === 'client' && (
                  <Link to="/client/cart" className="text-white mr-4">
                    <ShoppingCart className="h-6 w-6" />
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-white hover:text-gray-200"
                  aria-label="Выйти"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </>
            ) : (
              <Link to="/login/client" className="text-white hover:text-gray-200 flex items-center">
                <User className="h-5 w-5 mr-1" />
                <span>Войти</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;