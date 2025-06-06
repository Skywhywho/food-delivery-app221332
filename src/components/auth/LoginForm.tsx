import React, { useState } from 'react';
import { useStore } from '../../store/store';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../../types';

interface LoginFormProps {
  role: UserRole;
}

export const LoginForm: React.FC<LoginFormProps> = ({ role }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const login = useStore(state => state.login);
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const user = login(email, password, role);
    
    if (user) {
      if (role === 'client') {
        navigate('/client/menu');
      } else if (role === 'courier') {
        navigate('/courier/dashboard');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      }
    } else {
      setError('Неверный email или пароль');
    }
  };
  
  const getRoleName = () => {
    switch(role) {
      case 'client':
        return 'клиента';
      case 'courier':
        return 'курьера';
      case 'admin':
        return 'администратора';
      default:
        return '';
    }
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Вход для {getRoleName()}</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="flex items-center justify-between pt-4">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            Войти
          </button>
          
          {role !== 'admin' && (
            <Link
              to={role === 'client' ? '/register' : '/register/courier'}
              className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-600 rounded px-4 py-2 hover:bg-indigo-50"
            >
              Зарегистрироваться
            </Link>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginForm;