import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/store';
import { Toaster } from 'react-hot-toast';

// Layouts
import Layout from './components/layout/Layout';

// Auth Components
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import CourierRegisterForm from './components/auth/CourierRegisterForm';

// Client Components
import Menu from './components/client/Menu';
import OrderList from './components/client/OrderList';

// Courier Components
import CourierDashboard from './components/courier/CourierDashboard';
import CourierHistory from './components/courier/CourierHistory';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import OrderControl from './components/admin/OrderControl';
import CourierList from './components/admin/CourierList';

// Home Components
import LandingPage from './components/home/LandingPage';

// Protected route wrapper
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRole: string;
}> = ({ children, allowedRole }) => {
  const currentUser = useStore(state => state.currentUser);
  
  if (!currentUser) {
    return <Navigate to="/" />;
  }
  
  if (currentUser.role !== allowedRole) {
    if (currentUser.role === 'client') {
      return <Navigate to="/client/menu" />;
    } else if (currentUser.role === 'courier') {
      return <Navigate to="/courier/dashboard" />;
    } else if (currentUser.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    }
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  const currentUser = useStore(state => state.currentUser);
  
  useEffect(() => {
    // Demo: Auto-assign orders and complete deliveries
    const interval = setInterval(() => {
      const store = useStore.getState();
      const { orders, users } = store;
      
      // Find orders in assembly
      const ordersInAssembly = orders.filter(o => o.status === 'в сборке');
      
      // Find available couriers
      const availableCouriers = users
        .filter(u => u.role === 'courier')
        .filter(courier => {
          const courierActiveOrders = orders.filter(
            o => o.assignedCourierId === courier.id && o.status === 'доставка'
          );
          return courierActiveOrders.length < 3;
        });
      
      // Assign orders to available couriers
      if (ordersInAssembly.length > 0 && availableCouriers.length > 0) {
        // In a real app, this would be done by the server after 2 minutes
        // For demo purposes, we'll assign the first available order to the first available courier
        store.assignOrderToCourier(ordersInAssembly[0].id, availableCouriers[0].id);
      }
    }, 10000); // Check every 10 seconds for demo purposes
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Home / Landing */}
          <Route path="/" element={
            currentUser ? (
              currentUser.role === 'client' ? (
                <Navigate to="/client/menu" />
              ) : currentUser.role === 'courier' ? (
                <Navigate to="/courier/dashboard" />
              ) : (
                <Navigate to="/admin/dashboard" />
              )
            ) : (
              <LandingPage />
            )
          } />
          
          {/* Auth Routes */}
          <Route path="/login/client" element={<LoginForm role="client" />} />
          <Route path="/login/courier" element={<LoginForm role="courier" />} />
          <Route path="/login/admin" element={<LoginForm role="admin" />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/register/courier" element={<CourierRegisterForm />} />
          
          {/* Client Routes */}
          <Route path="/client/menu" element={
            <ProtectedRoute allowedRole="client">
              <Menu />
            </ProtectedRoute>
          } />
          <Route path="/client/orders" element={
            <ProtectedRoute allowedRole="client">
              <OrderList />
            </ProtectedRoute>
          } />
          
          {/* Courier Routes */}
          <Route path="/courier/dashboard" element={
            <ProtectedRoute allowedRole="courier">
              <CourierDashboard />
            </ProtectedRoute>
          } />
          <Route path="/courier/history" element={
            <ProtectedRoute allowedRole="courier">
              <CourierHistory />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute allowedRole="admin">
              <OrderControl />
            </ProtectedRoute>
          } />
          <Route path="/admin/couriers" element={
            <ProtectedRoute allowedRole="admin">
              <CourierList />
            </ProtectedRoute>
          } />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        <Toaster position="top-right" />
      </Layout>
    </Router>
  );
}

export default App;