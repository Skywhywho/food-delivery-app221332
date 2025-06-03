import React from 'react';
import { useStore } from '../../store/store';
import { User, Package, CheckCircle, XCircle } from 'lucide-react';

const CourierList: React.FC = () => {
  const { users, orders } = useStore();
  
  const couriers = users.filter(user => user.role === 'courier');
  
  const getCourierStats = (courierId: string) => {
    const courierOrders = orders.filter(order => order.assignedCourierId === courierId);
    
    const activeOrders = courierOrders.filter(order => order.status === 'доставка');
    const completedOrders = courierOrders.filter(order => order.status === 'доставлен');
    const canceledOrders = courierOrders.filter(order => order.status === 'отменен');
    
    return {
      active: activeOrders.length,
      completed: completedOrders.length,
      canceled: canceledOrders.length,
      total: courierOrders.length
    };
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Все курьеры</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Курьер
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Контакты
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Активные заказы
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Всего заказов
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Доставлено
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Отменено
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {couriers.map((courier) => {
              const stats = getCourierStats(courier.id);
              
              return (
                <tr key={courier.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {courier.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {courier.id.substring(0, 8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{courier.phone}</div>
                    <div className="text-sm text-gray-500">{courier.email}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="text-sm text-gray-900">{stats.active}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stats.total}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-gray-900">{stats.completed}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm text-gray-900">{stats.canceled}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourierList;