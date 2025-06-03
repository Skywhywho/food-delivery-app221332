import React, { useState } from 'react';
import { useStore } from '../../store/store';
import { Cloud, CloudRain, User, Package } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/helpers';

const AdminDashboard: React.FC = () => {
  const { orders, users, menuItems, weather, updateWeather } = useStore();
  const [orderToModify, setOrderToModify] = useState<any>(null);
  
  const inAssemblyOrders = orders.filter(order => order.status === 'в сборке');
  const inDeliveryOrders = orders.filter(order => order.status === 'доставка');
  const availableCouriers = users.filter(user => {
    if (user.role !== 'courier') return false;
    
    // Check if courier has less than 3 active orders
    const courierActiveOrders = orders.filter(
      o => o.assignedCourierId === user.id && o.status === 'доставка'
    );
    
    return courierActiveOrders.length < 3;
  });
  
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
  
  const toggleWeather = () => {
    updateWeather({
      condition: weather.condition === 'good' ? 'bad' : 'good',
      icon: weather.condition === 'good' ? 'cloud-rain' : 'sun'
    });
  };
  
  const handleModifyOrder = () => {
    if (!orderToModify) return;
    
    const orderItemsForUpdate = orderToModify.items.map((item: any) => ({
      menuItemId: item.id || item.menuItemId,
      quantity: item.quantity
    }));
    
    useStore.getState().updateOrder(orderToModify.id, orderItemsForUpdate);
    setOrderToModify(null);
  };
  
  const updateOrderItemQuantity = (itemIndex: number, newQuantity: number) => {
    if (!orderToModify) return;
    
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or negative
      setOrderToModify({
        ...orderToModify,
        items: orderToModify.items.filter((_: any, i: number) => i !== itemIndex)
      });
    } else {
      // Update quantity
      setOrderToModify({
        ...orderToModify,
        items: orderToModify.items.map((item: any, i: number) => 
          i === itemIndex ? { ...item, quantity: newQuantity } : item
        )
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Панель управления</h1>
        
        <div className="flex items-center bg-white rounded-lg shadow-sm p-3">
          <span className="text-gray-700 mr-3">Погода:</span>
          <button
            onClick={toggleWeather}
            className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              weather.condition === 'good'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {weather.condition === 'good' ? (
              <>
                <Cloud className="h-4 w-4 mr-1" />
                Хорошая погода
              </>
            ) : (
              <>
                <CloudRain className="h-4 w-4 mr-1" />
                Плохая погода
              </>
            )}
          </button>
          <span className="text-sm text-gray-500 ml-3">
            {weather.condition === 'good' ? '20 мин' : '30 мин'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <DashboardColumn
          title="В сборке"
          icon={<Package className="h-5 w-5 text-yellow-500" />}
          count={inAssemblyOrders.length}
          items={inAssemblyOrders}
          renderItem={(order) => (
            <OrderCard
              key={order.id}
              order={order}
              items={getOrderItems(order)}
              clientInfo={getClientInfo(order.clientId)}
              courierInfo={null}
              onModifyOrder={() => {
                setOrderToModify({
                  ...order,
                  items: getOrderItems(order)
                });
              }}
            />
          )}
        />
        
        <DashboardColumn
          title="Доставка"
          icon={<Package className="h-5 w-5 text-blue-500" />}
          count={inDeliveryOrders.length}
          items={inDeliveryOrders}
          renderItem={(order) => (
            <OrderCard
              key={order.id}
              order={order}
              items={getOrderItems(order)}
              clientInfo={getClientInfo(order.clientId)}
              courierInfo={getCourierInfo(order.assignedCourierId)}
              onModifyOrder={() => {
                setOrderToModify({
                  ...order,
                  items: getOrderItems(order)
                });
              }}
            />
          )}
        />
        
        <DashboardColumn
          title="Свободные курьеры"
          icon={<User className="h-5 w-5 text-green-500" />}
          count={availableCouriers.length}
          items={availableCouriers}
          renderItem={(courier) => (
            <CourierCard key={courier.id} courier={courier} />
          )}
        />
      </div>
      
      {orderToModify && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Изменение заказа #{orderToModify.id.substring(0, 8)}</h3>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Состав заказа:</h4>
              <ul className="space-y-2">
                {orderToModify.items.map((item: any, index: number) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-sm">{item.name}</span>
                    <div className="flex items-center">
                      <button
                        className="px-2 py-1 bg-gray-200 rounded-l"
                        onClick={() => updateOrderItemQuantity(index, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 bg-gray-100">{item.quantity}</span>
                      <button
                        className="px-2 py-1 bg-gray-200 rounded-r"
                        onClick={() => updateOrderItemQuantity(index, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setOrderToModify(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={handleModifyOrder}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface DashboardColumnProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  items: any[];
  renderItem: (item: any) => React.ReactNode;
}

const DashboardColumn: React.FC<DashboardColumnProps> = ({ 
  title, icon, count, items, renderItem
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {icon}
            <h3 className="text-lg font-semibold text-gray-800 ml-2">{title}</h3>
          </div>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
            {count}
          </span>
        </div>
      </div>
      
      <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Нет элементов</div>
        ) : (
          <div className="space-y-4">
            {items.map(renderItem)}
          </div>
        )}
      </div>
    </div>
  );
};

interface OrderCardProps {
  order: any;
  items: any[];
  clientInfo: any;
  courierInfo: any | null;
  onModifyOrder: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ 
  order, items, clientInfo, courierInfo, onModifyOrder
}) => {
  if (!clientInfo) return null;
  
  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium">Заказ #{order.id.substring(0, 8)}</h4>
          <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
        </div>
        
        <div className="mb-3 text-sm">
          <p className="text-gray-700">Клиент: {clientInfo.name}</p>
          {courierInfo && (
            <p className="text-gray-700">Курьер: {courierInfo.name}</p>
          )}
          <p className="text-gray-700">Адрес: {clientInfo.address}</p>
        </div>
        
        <div className="mb-3">
          <h5 className="text-xs font-medium text-gray-700 mb-1">Состав:</h5>
          <ul className="text-xs space-y-1">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs font-medium mt-1 text-right">
            Итого: {formatCurrency(order.totalPrice)}
          </p>
        </div>
        
        <button
          onClick={onModifyOrder}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Изменить заказ
        </button>
      </div>
    </div>
  );
};

interface CourierCardProps {
  courier: any;
}

const CourierCard: React.FC<CourierCardProps> = ({ courier }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4">
      <div className="flex items-center space-x-3">
        <div className="bg-green-100 p-2 rounded-full">
          <User className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h4 className="font-medium text-gray-800">{courier.name}</h4>
          <p className="text-sm text-gray-600">{courier.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;