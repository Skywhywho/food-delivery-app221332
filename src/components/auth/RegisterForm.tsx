import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/store';
import { useNavigate } from 'react-router-dom';

interface Address {
  address_id: number;
  street: string;
  house_number: string;
  apartment?: string;
  entrance?: string;
  floor?: number;
}

interface AddressesResponse {
  success: boolean;
  addresses: Address[];
  error?: string;
}

interface RegisterResponse {
  success: boolean;
  client?: {
    client_id: number;
  };
  error?: string;
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: '',
  });
  
  const [streets, setStreets] = useState<string[]>([]);
  const [selectedStreet, setSelectedStreet] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const register = useStore(state => state.register);
  const navigate = useNavigate();
  
  // Загрузка списка улиц при монтировании компонента
  useEffect(() => {
    loadStreets();
  }, []);

  // Загрузка адресов при выборе улицы
  useEffect(() => {
    if (selectedStreet) {
      loadAddresses(selectedStreet);
    }
  }, [selectedStreet]);

  const loadStreets = async () => {
    try {
      const response = await fetch('http://localhost/food-delivery-app/api/addresses.php');
      const data = await response.json() as AddressesResponse;
      if (data.success) {
        const uniqueStreets = [...new Set(data.addresses.map(addr => addr.street))];
        setStreets(uniqueStreets);
      }
    } catch (err) {
      setError('Не удалось загрузить список улиц');
    }
  };

  const loadAddresses = async (street: string) => {
    try {
      const response = await fetch(`http://localhost/food-delivery-app/api/addresses.php?street=${encodeURIComponent(street)}`);
      const data = await response.json() as AddressesResponse;
      if (data.success) {
        setAddresses(data.addresses);
      }
    } catch (err) {
      setError('Не удалось загрузить адреса');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Регистрация через API
      const response = await fetch('http://localhost/food-delivery-app/api/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email || undefined
        }),
      });

      const data = await response.json() as RegisterResponse;

      if (!data.success) {
        throw new Error(data.error || 'Ошибка при регистрации');
      }

      // Если выбран адрес, привязываем его к клиенту
      if (selectedAddress && data.client?.client_id) {
        await fetch('http://localhost/food-delivery-app/api/addresses.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: data.client.client_id,
            address_id: selectedAddress.address_id
          }),
        });
      }

      // Регистрация в локальном хранилище
      register({
        name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: selectedAddress ? `${selectedAddress.street}, ${selectedAddress.house_number}` : '',
        role: 'client'
      });
      
      navigate('/client/menu');
    } catch (err) {
      setError('Ошибка при регистрации. Пожалуйста, попробуйте еще раз.');
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Регистрация клиента</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
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
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Улица
          </label>
          <select
            value={selectedStreet}
            onChange={(e) => setSelectedStreet(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Выберите улицу</option>
            {streets.map((street) => (
              <option key={street} value={street}>
                {street}
              </option>
            ))}
          </select>
        </div>

        {selectedStreet && (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Адрес
            </label>
            <select
              value={selectedAddress?.address_id || ''}
              onChange={(e) => {
                const address = addresses.find(a => a.address_id === Number(e.target.value));
                setSelectedAddress(address || null);
              }}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Выберите адрес</option>
              {addresses.map((address) => (
                <option key={address.address_id} value={address.address_id}>
                  {`дом ${address.house_number}${address.apartment ? `, кв. ${address.apartment}` : ''}${address.entrance ? `, подъезд ${address.entrance}` : ''}${address.floor ? `, этаж ${address.floor}` : ''}`}
                </option>
              ))}
            </select>
          </div>
        )}
        
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
          
          <a
            href="/login/client"
            className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-800"
          >
            Уже есть аккаунт?
          </a>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;