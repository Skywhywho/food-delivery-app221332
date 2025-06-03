import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, UserCog } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">ЭкспрессДоставка</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Быстрая доставка вашей любимой еды в любую точку города
          </p>
          <Link
            to="/login/client"
            className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 inline-block"
          >
            Сделать заказ
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Как это работает</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Наша система доставки соединяет клиентов, курьеров и рестораны в единую экосистему
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="bg-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Клиенты</h3>
            <p className="text-gray-600 mb-6">
              Выбирайте из разнообразного меню, делайте заказы и отслеживайте статус доставки в реальном времени
            </p>
            <Link
              to="/login/client"
              className="text-indigo-600 font-medium hover:text-indigo-800 transition duration-200"
            >
              Войти как клиент →
            </Link>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="bg-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Курьеры</h3>
            <p className="text-gray-600 mb-6">
              Получайте заказы автоматически, связывайтесь с клиентами и отслеживайте свои достижения
            </p>
            <Link
              to="/login/courier"
              className="text-indigo-600 font-medium hover:text-indigo-800 transition duration-200"
            >
              Войти как курьер →
            </Link>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="bg-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <UserCog className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Администраторы</h3>
            <p className="text-gray-600 mb-6">
              Контролируйте все процессы, управляйте заказами и отслеживайте работу курьеров
            </p>
            <Link
              to="/login/admin"
              className="text-indigo-600 font-medium hover:text-indigo-800 transition duration-200"
            >
              Войти как администратор →
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 py-16 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Авторизация для тестирования</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2 text-indigo-600">Клиент</h3>
              <p className="text-sm text-gray-600 mb-1">Email: client@example.com</p>
              <p className="text-sm text-gray-600">Пароль: client123</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2 text-indigo-600">Курьер</h3>
              <p className="text-sm text-gray-600 mb-1">Email: courier@example.com</p>
              <p className="text-sm text-gray-600">Пароль: courier123</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2 text-indigo-600">Администратор</h3>
              <p className="text-sm text-gray-600 mb-1">Email: admin@example.com</p>
              <p className="text-sm text-gray-600">Пароль: admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;