import { MenuItem, User, Order, WeatherState } from '../types';

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Пицца Маргарита',
    description: 'Классическая итальянская пицца с томатным соусом и моцареллой',
    price: 450,
    weight: 450,
    image: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg',
    category: 'Пицца'
  },
  {
    id: '2',
    name: 'Пицца Пепперони',
    description: 'Пицца с томатным соусом, моцареллой и пепперони',
    price: 550,
    weight: 480,
    image: 'https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg',
    category: 'Пицца'
  },
  {
    id: '3',
    name: 'Цезарь с курицей',
    description: 'Салат с куриной грудкой, сыром пармезан, гренками и соусом цезарь',
    price: 380,
    weight: 250,
    image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg',
    category: 'Салаты'
  },
  {
    id: '4',
    name: 'Греческий салат',
    description: 'Классический греческий салат с сыром фета и оливками',
    price: 320,
    weight: 230,
    image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg',
    category: 'Салаты'
  },
  {
    id: '5',
    name: 'Паста Карбонара',
    description: 'Классическая итальянская паста с беконом, яйцом и сыром',
    price: 420,
    weight: 350,
    image: 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg',
    category: 'Паста'
  },
  {
    id: '6',
    name: 'Стейк из говядины',
    description: 'Сочный стейк из мраморной говядины с гарниром из картофеля',
    price: 850,
    weight: 400,
    image: 'https://images.pexels.com/photos/1251208/pexels-photo-1251208.jpeg',
    category: 'Горячие блюда'
  },
  {
    id: '7',
    name: 'Чизкейк',
    description: 'Классический чизкейк с ягодным соусом',
    price: 280,
    weight: 150,
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
    category: 'Десерты'
  },
  {
    id: '8',
    name: 'Тирамису',
    description: 'Итальянский десерт на основе маскарпоне и печенья савоярди',
    price: 320,
    weight: 180,
    image: 'https://images.pexels.com/photos/6605308/pexels-photo-6605308.jpeg',
    category: 'Десерты'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Иван Иванов',
    phone: '+7 (900) 123-45-67',
    email: 'client@example.com',
    password: 'client123',
    role: 'client',
    address: 'ул. Пушкина, д. 10, кв. 5'
  },
  {
    id: '2',
    name: 'Петр Петров',
    phone: '+7 (900) 234-56-78',
    email: 'courier@example.com',
    password: 'courier123',
    role: 'courier'
  },
  {
    id: '3',
    name: 'Анна Сидорова',
    phone: '+7 (900) 345-67-89',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: '4',
    name: 'Алексей Смирнов',
    phone: '+7 (900) 456-78-90',
    email: 'courier2@example.com',
    password: 'courier123',
    role: 'courier'
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    clientId: '1',
    items: [{ menuItemId: '1', quantity: 1 }, { menuItemId: '3', quantity: 1 }],
    status: 'доставлен',
    createdAt: new Date(new Date().getTime() - 3600000),
    assignedCourierId: '2',
    assignedAt: new Date(new Date().getTime() - 3540000),
    deliveredAt: new Date(new Date().getTime() - 2400000),
    totalPrice: 830,
    estimatedDeliveryTime: 20,
    review: {
      rating: 5,
      comment: 'Очень вкусно и быстрая доставка!',
      createdAt: new Date(new Date().getTime() - 2300000)
    }
  }
];

export const mockWeather: WeatherState = {
  condition: 'good',
  icon: 'sun'
};