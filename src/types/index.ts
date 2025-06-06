export type UserRole = 'client' | 'courier' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  address?: string;
  transport_type?: string;
  status?: 'свободен' | 'занят' | 'не работает';
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  image: string;
  category: string;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
}

export interface Order {
  id: string;
  clientId: string;
  items: OrderItem[];
  status: 'в сборке' | 'доставка' | 'доставлен' | 'отменен';
  createdAt: Date;
  assignedCourierId?: string;
  assignedAt?: Date;
  deliveredAt?: Date;
  canceledAt?: Date;
  cancelReason?: string;
  totalPrice: number;
  review?: Review;
  estimatedDeliveryTime: number;
}

export interface Review {
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface CourierStats {
  totalDeliveries: number;
  totalCancellations: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: Date;
}

export interface WeatherState {
  condition: 'good' | 'bad';
  icon: string;
}

export interface AppState {
  users: User[];
  currentUser: User | null;
  menuItems: MenuItem[];
  orders: Order[];
  weather: WeatherState;
}