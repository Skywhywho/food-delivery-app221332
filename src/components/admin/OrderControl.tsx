import React, { useState } from 'react';
import { useStore } from '../../store/store';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { Check, X, MessageSquare } from 'lucide-react';

const OrderControl: React.FC = () => {
  const { orders, users, menuItems } = useStore();
  const [selectedTab, setSelectedTab] = useState<string>('current');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  
  const currentOrders = orders.filter(order => 
    order.status === 'в сборке' || order.status === 'доставка'
  );
  
  const deliveredOrders = orders.filter(order => 
    order.status === 'доставлен'
  );
  
  const canceledOrders = orders.filter(order => 
    order.status === 'отменен'
  );
  
  const reviewedOrders = orders.filter(order => 
    order.status === 'доставлен' && order.review
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
  
  const getClientInfo = (clientId: string) => {
    return users.find(user => user.id === clientId);
  };
  
  const getCourierInfo = (courierId?: string) => {
    if (!courierId) return null;
    return users.find(user => user.id === courierId);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Контроль заказов</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 px-4 text-center ${
              selectedTab === 'current' 
                ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedTab('current')}
          >
            Текущие заказы ({currentOrders.length})
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center ${
              selectedTab === 'delivered' 
                ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedTab('delivered')}
          >
            Доставленные ({deliveredOrders.length})
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center ${
              selectedTab === 'canceled' 
                ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedTab('canceled')}
          >
            Отмененные ({canceledOrders.length})
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center ${
              selectedTab === 'reviews' 
                ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedTab('reviews')}
          >
            Отзывы ({reviewedOrders.length})
          </button>
        </div>
        
        <div className="p-4">
          {selectedTab === 'current' && (
            <OrderList
              orders={currentOrders}
              getOrderItems={getOrderItems}
              getClientInfo={getClientInfo}
              getCourierInfo={getCourierInfo}
              onSelectOrder={setSelectedOrder}
            />
          )}
          
          {selectedTab === 'delivered' && (
            <OrderList
              orders={deliveredOrders}
              getOrderItems={getOrderItems}
              getClientInfo={getClientInfo}
              getCourierInfo={getCourierInfo}
              onSelectOrder={setSelectedOrder}
            />
          )}
          
          {selectedTab === 'canceled' && (
            <OrderList
              orders={canceledOrders}
              getOrderItems={getOrderItems}
              getClientInfo={getClientInfo}
              getCourierInfo={getCourierInfo}
              onSelectOrder={setSelectedOrder}
              showCancelReason
            />
          )}
          
          {selectedTab === 'reviews' && (
            <ReviewList
              orders={reviewedOrders}
              getClientInfo={getClientInfo}
            />
          )}
        </div>
      </div>
      
      {selectedOrder && (
        <OrderDetail
          order={orders.find(o => o.id === selectedOrder)!}
          getOrderItems={getOrderItems}
          getClientInfo={getClientInfo}
          getCourierInfo={getCourierInfo}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

interface OrderListProps {
  orders: any[];
  getOrderItems: (order: any) => any[];
  getClientInfo: (clientId: string) => any;
  getCourierInfo: (courierId?: string) => any;
  onSelectOrder: (orderId: string) => void;
  showCancelReason?: boolean;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  getOrderItems,
  getClientInfo,
  getCourierInfo,
  onSelectOrder,
  showCancelReason
}) => {
  if (orders.length === 0) {
    return <p className="text-center py-8 text-gray-500">Нет заказов</p>;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Статус
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Клиент
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Курьер
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Время
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Сумма
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => {
            const client = getClientInfo(order.clientId);
            const courier = getCourierInfo(order.assignedCourierId);
            
            if (!client) return null;
            
            return (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{order.id.substring(0, 8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 'в сборке' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'доставка' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'доставлен' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {client.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {courier ? courier.name : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(order.totalPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onSelectOrder(order.id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Подробнее
                  </button>
                  
                  {showCancelReason && order.cancelReason && (
                    <div className="text-xs text-red-500 mt-1">
                      Причина: {order.cancelReason}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

interface ReviewListProps {
  orders: any[];
  getClientInfo: (clientId: string) => any;
}

const ReviewList: React.FC<ReviewListProps> = ({ orders, getClientInfo }) => {
  if (orders.length === 0) {
    return <p className="text-center py-8 text-gray-500">Нет отзывов</p>;
  }
  
  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const client = getClientInfo(order.clientId);
        if (!client || !order.review) return null;
        
        return (
          <div key={order.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-800">
                  Отзыв к заказу #{order.id.substring(0, 8)}
                </h4>
                <p className="text-sm text-gray-500">
                  Клиент: {client.name} • {formatDate(order.review.createdAt)}
                </p>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} filled={i < order.review.rating} />
                ))}
              </div>
            </div>
            <div className="mt-2 text-gray-700 bg-white p-3 rounded border border-gray-200">
              <div className="flex items-start">
                <MessageSquare className="h-4 w-4 text-gray-400 mt-1 mr-2" />
                <p>{order.review.comment}</p>
              </div>
            </div>
          </div>
        );
      })}
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

interface OrderDetailProps {
  order: any;
  getOrderItems: (order: any) => any[];
  getClientInfo: (clientId: string) => any;
  getCourierInfo: (courierId?: string) => any;
  onClose: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({
  order,
  getOrderItems,
  getClientInfo,
  getCourierInfo,
  onClose
}) => {
  const items = getOrderItems(order);
  const client = getClientInfo(order.clientId);
  const courier = getCourierInfo(order.assignedCourierId);
  
  if (!client) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Подробности заказа #{order.id.substring(0, 8)}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-3">Информация о заказе</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Статус:</span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  order.status === 'в сборке' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'доставка' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'доставлен' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Создан:</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              {order.assignedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Назначен:</span>
                  <span>{formatDate(order.assignedAt)}</span>
                </div>
              )}
              {order.deliveredAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Доставлен:</span>
                  <span>{formatDate(order.deliveredAt)}</span>
                </div>
              )}
              {order.canceledAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Отменен:</span>
                  <span>{formatDate(order.canceledAt)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold">
                <span>Сумма:</span>
                <span>{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
            
            {order.cancelReason && (
              <div className="mt-4 bg-red-50 p-3 rounded border border-red-100">
                <h5 className="text-sm font-medium text-red-800 mb-1">Причина отмены:</h5>
                <p className="text-sm text-red-700">{order.cancelReason}</p>
              </div>
            )}
            
            {order.review && (
              <div className="mt-4 bg-indigo-50 p-3 rounded border border-indigo-100">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="text-sm font-medium text-indigo-800">Отзыв клиента:</h5>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} filled={i < order.review.rating} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-indigo-700">{order.review.comment}</p>
              </div>
            )}
          </div>
          
          <div>
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-3">Состав заказа</h4>
              <ul className="space-y-2">
                {items.map((item: any) => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span className="text-gray-600">{formatCurrency(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-3">Информация о клиенте</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm"><strong>ФИО:</strong> {client.name}</p>
                <p className="text-sm"><strong>Телефон:</strong> {client.phone}</p>
                <p className="text-sm"><strong>Email:</strong> {client.email}</p>
                <p className="text-sm"><strong>Адрес:</strong> {client.address}</p>
              </div>
            </div>
            
            {courier && (
              <div>
                <h4 className="text-lg font-semibold mb-3">Информация о курьере</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm"><strong>ФИО:</strong> {courier.name}</p>
                  <p className="text-sm"><strong>Телефон:</strong> {courier.phone}</p>
                  <p className="text-sm"><strong>Email:</strong> {courier.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderControl;