import React from 'react';
import Header from './Header';
import { useStore } from '../../store/store';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const weather = useStore(state => state.weather);

  return (
    <div className={`min-h-screen flex flex-col ${weather.condition === 'bad' ? 'bg-gray-100' : 'bg-gray-50'}`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className={`py-4 ${weather.condition === 'bad' ? 'bg-gray-600' : 'bg-indigo-600'} text-white text-center`}>
        <div className="container mx-auto">
          <p>© 2025 ЭкспрессДоставка. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;