export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const calculateTotalPrice = (items: {quantity: number, price: number}[]): number => {
  return items.reduce((total, item) => total + (item.quantity * item.price), 0);
};

export const formatOrderStatus = (status: string): string => {
  switch(status) {
    case 'в сборке':
      return 'Заказ собирается';
    case 'доставка':
      return 'Заказ в пути';
    case 'доставлен':
      return 'Заказ доставлен';
    case 'отменен':
      return 'Заказ отменен';
    default:
      return status;
  }
};