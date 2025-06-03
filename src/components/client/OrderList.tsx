import React, { useState } from 'react';
import { useStore } from '../../store/store';
import { formatDate, formatCurrency, formatOrderStatus } from '../../utils/helpers';
import { Star } from 'lucide-react';

const OrderList: React.FC = () => {
  const { orders, menuItems, currentUser, addReview } = useStore();
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  
  if (!currentUser) return null;
  
  const userOrders = orders
    .filter(order => order.clientId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const getOrderItems = (order: any) => {
    return order.items.map((item: any) => {
      const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
      return {
        ...menuItem,
        quantity: item.quantity
      };
    });
  };
  
  const handleReviewSubmit = (e: React.FormEvent, orderId: string) => {
    e.preventDefault();
    addReview(orderId, rating, comment);
    setReviewOrderId(null);
    setRating(5);
    setComment('');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Мои заказы</h1>
      
      {userOrders.length === 0 ? (
        <p className="text-gray-600 text-center">У вас пока нет заказов</p>
      ) : (
        <div className="space-y-6">
          {userOrders.map(order => {
            const orderItems = getOrderItems(order);
            
            return (
              <div 
                key={order.id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-500 ${
                  order.status === 'доставлен' ? 'border-l-4 border-green-500' :
                  order.status === 'доставка' ? 'border-l-4 border-blue-500' :
                  order.status === 'в сборке' ? 'border-l-4 border-yellow-500' :
                  'border-l-4 border-red-500'
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-wrap justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Заказ #{order.id.substring(0, 8)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'доставлен' ? 'bg-green-100 text-green-800' :
                      order.status === 'доставка' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'в сборке' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {formatOrderStatus(order.status)}
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
                    
                    {order.status === 'доставлен' && !order.review && (
                      <button
                        onClick={() => setReviewOrderId(order.id)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Оставить отзыв
                      </button>
                    )}
                    
                    {order.review && (
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < order.review!.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">Оставлен отзыв</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {reviewOrderId === order.id && (
                  <div className="bg-gray-50 p-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Оставить отзыв:</h4>
                    <form onSubmit={(e) => handleReviewSubmit(e, order.id)}>
                      <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-1">Оценка:</label>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="focus:outline-none"
                            >
                              <Star 
                                className={`h-6 w-6 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-1">Комментарий:</label>
                        <textarea
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          rows={3}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setReviewOrderId(null)}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded transition duration-300"
                        >
                          Отмена
                        </button>
                        <button
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                        >
                          Отправить
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderList;