import { create } from 'zustand';
import { AppState, Order, User, MenuItem, UserRole, OrderItem, WeatherState } from '../types';
import { mockMenuItems, mockOrders, mockUsers, mockWeather } from '../utils/mockData';
import { generateId } from '../utils/helpers';

interface StoreActions {
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string, role: UserRole) => User | null;
  logout: () => void;
  register: (user: Omit<User, 'id'>) => User;
  createOrder: (clientId: string, items: OrderItem[]) => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], reason?: string) => void;
  assignOrderToCourier: (orderId: string, courierId: string) => void;
  addReview: (orderId: string, rating: number, comment: string) => void;
  updateWeather: (weather: WeatherState) => void;
  updateOrder: (orderId: string, items: OrderItem[]) => void;
}

// Load initial state from localStorage if available
const loadState = (): Partial<AppState> => {
  try {
    const storedState = localStorage.getItem('foodDeliveryAppState');
    return storedState ? JSON.parse(storedState) : {};
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    return {};
  }
};

const saveState = (state: AppState) => {
  try {
    const stateToSave = {
      users: state.users,
      orders: state.orders,
      weather: state.weather
    };
    localStorage.setItem('foodDeliveryAppState', JSON.stringify(stateToSave));
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
};

const initialState = loadState();

export const useStore = create<AppState & StoreActions>((set, get) => ({
  users: initialState.users || mockUsers,
  currentUser: initialState.currentUser || null,
  menuItems: mockMenuItems,
  orders: initialState.orders || mockOrders,
  weather: initialState.weather || mockWeather,

  setCurrentUser: (user) => set({ currentUser: user }),

  login: (email, password, role) => {
    const user = get().users.find(u => 
      u.email === email && 
      u.password === password && 
      u.role === role
    );
    
    if (user) {
      set({ currentUser: user });
    }
    
    return user || null;
  },

  logout: () => set({ currentUser: null }),

  register: (userData) => {
    const newUser = { ...userData, id: generateId() };
    set(state => {
      const updatedUsers = [...state.users, newUser];
      const updatedState = { ...state, users: updatedUsers, currentUser: newUser };
      saveState(updatedState);
      return updatedState;
    });
    return newUser;
  },

  createOrder: (clientId, items) => {
    const { menuItems, weather } = get();
    
    const totalPrice = items.reduce((sum, item) => {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
      return sum + (menuItem?.price || 0) * item.quantity;
    }, 0);
    
    const newOrder: Order = {
      id: generateId(),
      clientId,
      items,
      status: 'в сборке',
      createdAt: new Date(),
      totalPrice,
      estimatedDeliveryTime: weather.condition === 'good' ? 20 : 30
    };
    
    set(state => {
      const updatedOrders = [...state.orders, newOrder];
      const updatedState = { ...state, orders: updatedOrders };
      saveState(updatedState);
      return updatedState;
    });

    // Setup timer to auto-assign order to courier after 2 minutes
    setTimeout(() => {
      const state = get();
      const order = state.orders.find(o => o.id === newOrder.id);
      
      if (order && order.status === 'в сборке') {
        const availableCouriers = state.users
          .filter(u => u.role === 'courier')
          .filter(courier => {
            const courierActiveOrders = state.orders.filter(
              o => o.assignedCourierId === courier.id && o.status === 'доставка'
            );
            return courierActiveOrders.length < 3;
          });
        
        if (availableCouriers.length > 0) {
          const courier = availableCouriers[0];
          get().assignOrderToCourier(newOrder.id, courier.id);
        }
      }
    }, 120000); // 2 minutes

    return newOrder;
  },

  updateOrderStatus: (orderId, status, reason) => {
    set(state => {
      const updatedOrders = state.orders.map(order => {
        if (order.id === orderId) {
          const updates: Partial<Order> = { status };
          
          if (status === 'доставлен') {
            updates.deliveredAt = new Date();
          } else if (status === 'отменен') {
            updates.canceledAt = new Date();
            updates.cancelReason = reason;
          }
          
          return { ...order, ...updates };
        }
        return order;
      });
      
      const updatedState = { ...state, orders: updatedOrders };
      saveState(updatedState);
      return updatedState;
    });
  },

  assignOrderToCourier: (orderId, courierId) => {
    set(state => {
      const updatedOrders = state.orders.map(order => {
        if (order.id === orderId) {
          return { 
            ...order, 
            status: 'доставка',
            assignedCourierId: courierId, 
            assignedAt: new Date() 
          };
        }
        return order;
      });
      
      const updatedState = { ...state, orders: updatedOrders };
      saveState(updatedState);
      return updatedState;
    });
    
    // Auto-complete delivery after delivery time
    setTimeout(() => {
      const state = get();
      const order = state.orders.find(o => o.id === orderId);
      
      if (order && order.status === 'доставка') {
        get().updateOrderStatus(orderId, 'доставлен');
      }
    }, get().weather.condition === 'good' ? 20 * 60 * 1000 : 30 * 60 * 1000);
  },

  addReview: (orderId, rating, comment) => {
    set(state => {
      const updatedOrders = state.orders.map(order => {
        if (order.id === orderId) {
          return { 
            ...order, 
            review: { 
              rating, 
              comment, 
              createdAt: new Date() 
            } 
          };
        }
        return order;
      });
      
      const updatedState = { ...state, orders: updatedOrders };
      saveState(updatedState);
      return updatedState;
    });
  },
  
  updateWeather: (weather) => {
    set(state => {
      const updatedState = { ...state, weather };
      saveState(updatedState);
      return updatedState;
    });
  },
  
  updateOrder: (orderId, items) => {
    const { menuItems } = get();
    
    const totalPrice = items.reduce((sum, item) => {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
      return sum + (menuItem?.price || 0) * item.quantity;
    }, 0);
    
    set(state => {
      const updatedOrders = state.orders.map(order => {
        if (order.id === orderId) {
          return { ...order, items, totalPrice };
        }
        return order;
      });
      
      const updatedState = { ...state, orders: updatedOrders };
      saveState(updatedState);
      return updatedState;
    });
  }
}));