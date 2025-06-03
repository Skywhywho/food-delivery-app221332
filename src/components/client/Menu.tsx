import React, { useState } from 'react';
import { useStore } from '../../store/store';
import { MenuItem } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface CartItem extends MenuItem {
  quantity: number;
}

const Menu: React.FC = () => {
  const menuItems = useStore(state => state.menuItems);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const categories = ['all', ...new Set(menuItems.map(item => item.category))];
  
  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);
  
  const addToCart = (menuItem: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === menuItem.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.id === menuItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...menuItem, quantity: 1 }];
      }
    });
  };
  
  const removeFromCart = (id: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === id);
      
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item => 
          item.id === id 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter(item => item.id !== id);
      }
    });
  };
  
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity, 0
  );
  
  const createUser = useStore(state => state.currentUser);
  const createOrder = useStore(state => state.createOrder);
  const navigate = (path: string) => window.location.href = path;
  
  const handleOrder = () => {
    if (!createUser) {
      navigate('/login/client');
      return;
    }
    
    if (cart.length === 0) {
      alert('Ваша корзина пуста');
      return;
    }
    
    const orderItems = cart.map(item => ({
      menuItemId: item.id,
      quantity: item.quantity
    }));
    
    createOrder(createUser.id, orderItems);
    setCart([]);
    navigate('/client/orders');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Меню</h1>
      
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-4 pb-2">
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              } transition-colors duration-200`}
              onClick={() => setActiveCategory(category)}
            >
              {category === 'all' ? 'Все' : category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                <span className="font-medium text-indigo-600">{formatCurrency(item.price)}</span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              <p className="text-gray-500 text-xs mb-4">Вес: {item.weight} г</p>
              <button
                onClick={() => addToCart(item)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-300"
              >
                Добавить в корзину
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 border-t border-gray-200">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Корзина</h3>
              <div className="flex flex-wrap items-center">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center mr-4 mb-2">
                    <span className="text-sm">{item.name} x {item.quantity}</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="ml-2 text-red-500 text-xs"
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="font-bold text-lg mr-4">Итого: {formatCurrency(totalPrice)}</span>
              <button
                onClick={handleOrder}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded transition duration-300"
              >
                Оформить заказ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;