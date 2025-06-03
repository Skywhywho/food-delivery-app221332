import React, { useState } from 'react';
import { useStore } from '../../store/store';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { Phone, XCircle } from 'lucide-react';

const CourierDashboard: React.FC = () => {
  const { orders, users, menuItems, currentUser, updateOrderStatus } = useStore();
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  
  if (!currentUser) return null;
  
  const activeOrders = orders
    .filter(order => order.assignedCourierId === currentUser.id && order.status === 'доставка')
    .sort((a, b) => new Date(a.assignedAt || 0).getTime() - new Date(b.assignedAt || 0).getTime());
  
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
  
  const handleCancelOrder = () => {
    if (!cancelOrderId || !cancelReason) return;
    
    updateOrderStatus(cancelOrderId, 'отменен', cancelReason);
    setCancelOrderId(null);
    setCancelReason('');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Панель курьера</h1>
      
      {activeOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-xl text-gray-600 mb-4">У вас нет активных заказов</p>
          <p className="text-gray-500">Ожидайте назначения нового заказа</p>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Текущие заказы ({activeOrders.length})</h2>
          
          {activeOrders.map(order => {
            const orderItems = getOrderItems(order);
            const client = getClientInfo(order.clientId);
            
            if (!client) return null;
            
            return (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Заказ #{order.id.substring(0, 8)}
                    </h3>
                    <span className="text-sm text-gray-500">
                      Назначен: {formatDate(order.assignedAt || new Date())}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Информация о клиенте:</h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm"><strong>ФИО:</strong> {client.name}</p>
                      <p className="text-sm"><strong>Адрес:</strong> {client.address}</p>
                      <div className="flex items-center mt-2">
                        <a
                          href={`tel:${client.phone}`}
                          className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Позвонить клиенту
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Состав заказа:</h4>
                    <ul className="space-y-1">
                      {orderItems.map((item: any) => (
                        <li key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} x {item.quantity}</span>
                          <span className="text-gray-600">{formatCurrency(item.price * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="font-medium">Итого: {formatCurrency(order.totalPrice)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => updateOrderStatus(order.id, 'доставлен')}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                    >
                      Заказ доставлен
                    </button>
                    
                    <button
                      onClick={() => setCancelOrderId(order.id)}
                      className="flex items-center text-red-600 hover:text-red-800"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Отменить заказ
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {cancelOrderId && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Отмена заказа</h3>
            <p className="mb-4 text-gray-600">Пожалуйста, укажите причину отмены заказа:</p>
            
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Причина отмены..."
              required
            ></textarea>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setCancelOrderId(null);
                  setCancelReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300"
                disabled={!cancelReason}
              >
                Подтвердить отмену
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourierDashboard;