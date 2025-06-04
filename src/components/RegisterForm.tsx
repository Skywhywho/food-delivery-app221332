import { useState, useEffect } from 'react';
import { api } from '../utils/api';

interface Address {
  address_id: number;
  street: string;
  house_number: string;
  apartment?: string;
  entrance?: string;
  floor?: number;
}

export function RegisterForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
  });
  
  const [streets, setStreets] = useState<string[]>([]);
  const [selectedStreet, setSelectedStreet] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const streetsList = await api.getStreets();
      setStreets(streetsList);
    } catch (err) {
      setError('Не удалось загрузить список улиц');
    }
  };

  const loadAddresses = async (street: string) => {
    try {
      const addressList = await api.getAddressesByStreet(street);
      setAddresses(addressList);
    } catch (err) {
      setError('Не удалось загрузить адреса');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Регистрация клиента
      const response = await api.register(formData);
      const clientId = response.client.client_id;

      // Если выбран адрес, привязываем его к клиенту
      if (selectedAddress) {
        await api.updateClientAddress(clientId, selectedAddress.address_id);
      }

      // Очищаем форму после успешной регистрации
      setFormData({ full_name: '', phone: '', email: '' });
      setSelectedStreet('');
      setSelectedAddress(null);
      
      alert('Регистрация успешно завершена!');
    } catch (err) {
      setError('Ошибка при регистрации. Проверьте введенные данные.');
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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Регистрация</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">ФИО:</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Телефон:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Улица:</label>
          <select
            value={selectedStreet}
            onChange={(e) => setSelectedStreet(e.target.value)}
            className="w-full p-2 border rounded"
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
            <label className="block mb-1">Адрес:</label>
            <select
              value={selectedAddress?.address_id || ''}
              onChange={(e) => {
                const address = addresses.find(a => a.address_id === Number(e.target.value));
                setSelectedAddress(address || null);
              }}
              className="w-full p-2 border rounded"
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

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 text-white rounded ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
} 