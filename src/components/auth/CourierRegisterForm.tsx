import React, { useState } from 'react';
import { useStore } from '../../store/store';
import { useNavigate, Link } from 'react-router-dom';

const CourierRegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const register = useStore(state => state.register);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Sending registration data:', formData);

      // Регистрация через API
      const response = await fetch('http://localhost/food-delivery-app/api/register_courier.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      
      // Получаем текст ответа
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Пробуем распарсить JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        throw new Error(`Ошибка сервера: ${responseText}`);
      }

      console.log('Parsed response data:', data);

      if (!data.success) {
        throw new Error(data.error || 'Ошибка при регистрации');
      }

      // Регистрация в локальном хранилище
      register({
        name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'courier',
        status: 'свободен'
      });

      console.log('Registration successful, navigating to dashboard');
      navigate('/courier/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при регистрации. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Регистрация курьера</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 whitespace-pre-wrap">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            ФИО *
          </label>
          <input
            name="full_name"
            type="text"
            value={formData.full_name}
            onChange={handleInputChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Телефон *
          </label>
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Пароль *
          </label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300`}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
          
          <Link
            to="/login/courier"
            className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-800"
          >
            Уже есть аккаунт?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CourierRegisterForm; 