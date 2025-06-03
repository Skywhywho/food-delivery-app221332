import React from 'react';
import { useStore } from '../../store/store';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { CheckCircle, XCircle, Award } from 'lucide-react';

const CourierHistory: React.FC = () => {
  const { orders, menuItems, currentUser } = useStore();
  
  if (!currentUser) return null;
  
  const completedOrders = orders
    .filter(order => 
      order.assignedCourierId === currentUser.id && 
      (order.status === 'доставлен' || order.status === 'отменен')
    )
    .sort((a, b) => 
      new Date(b.deliveredAt || b.canceledAt || b.createdAt).getTime() - 
      new Date(a.deliveredAt || a.canceledAt || a.createdAt).getTime()
    );
  
  const getOrderItems = (order: any) => {
    return order.items.map((item: any) => {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
      return {
        ...menuItem,
        quantity: item.quantity
      };
    });
  };
  
  // Calculate achievements
  const deliveredCount = completedOrders.filter(o => o.status === 'доставлен').length;
  const canceledCount = completedOrders.filter(o => o.status === 'отменен').length;
  
  const achievements = [
    {
      id: 'first_delivery',
      name: 'Первая доставка',
      description: 'Выполнена первая доставка',
      unlocked: deliveredCount >= 1
    },
    {
      id: 'five_deliveries',
      name: 'Опытный курьер',
      description: 'Выполнено 5 доставок',
      unlocked: deliveredCount >= 5
    },
    {
      id: 'perfect_record',
      name: 'Безупречная репутация',
      description: 'Выполнено 10 доставок без отмен',
      unlocked: deliveredCount >= 10 && canceledCount === 0
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">История доставок</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-2">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Доставлено заказов</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{deliveredCount}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-2">
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Отменено заказов</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{canceledCount}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-2">
            <Award className="h-5 w-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Достижения</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {achievements.filter(a => a.unlocked).length}/{achievements.length}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
            <h3 className="text-lg font-semibold text-gray-800">Достижения</h3>
          </div>
          <div className="p-6">
            {achievements.length === 0 ? (
              <p className="text-gray-500">У вас пока нет достижений</p>
            ) : (
              <ul className="space-y-4">
                {achievements.map((achievement) => (
                  <li 
                    key={achievement.id}
                    className={`flex items-center p-3 rounded-md ${
                      achievement.unlocked 
                        ? 'bg-yellow-50 border border-yellow-200' 
                        : 'bg-gray-50 border border-gray-200 opacity-60'
                    }`}
                  >
                    <Award className={`h-6 w-6 mr-3 ${achievement.unlocked ? 'text-yellow-500' : 'text-gray-400'}`} />
                    <div>
                      <h4 className="font-medium">{achievement.name}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
            <h3 className="text-lg font-semibold text-gray-800">Статистика</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700">Успешные доставки</p>
                <div className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500"
                    style={{ 
                      width: `${completedOrders.length > 0 
                        ? (deliveredCount / completedOrders.length * 100) 
                        : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>{deliveredCount} доставлено</span>
                  <span>{completedOrders.length} всего</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700">Средний рейтинг</p>
                <div className="flex items-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} filled={star <= 5} />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-gray-800 mb-6">История заказов</h2>
      
      {completedOrders.length === 0 ? (
        <p className="text-gray-600 text-center">У вас пока нет выполненных заказов</p>
      ) : (
        <div className="space-y-6">
          {completedOrders.map(order => {
            const orderItems = getOrderItems(order);
            
            return (
              <div 
                key={order.id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden ${
                  order.status === 'доставлен' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-wrap justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Заказ #{order.id.substring(0, 8)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.deliveredAt || order.canceledAt || order.createdAt)}
                      </p>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'доставлен' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status === 'доставлен' ? 'Доставлен' : 'Отменен'}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Состав заказа:</h4>
                    <ul className="space-y-1">
                      {orderItems.map((item: any) => (
                        <li key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} x {item.quantity}</span>
                          <span className="text-gray-600">{formatCurrency(item.price * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="font-medium">Итого: {formatCurrency(order.totalPrice)}</span>
                    
                    {order.status === 'отменен' && order.cancelReason && (
                      <div className="text-sm text-red-600">
                        <strong>Причина отмены:</strong> {order.cancelReason}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Star component for ratings
const Star: React.FC<{ filled: boolean }> = ({ filled }) => {
  return (
    <svg className={`h-4 w-4 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
};

export default CourierHistory;