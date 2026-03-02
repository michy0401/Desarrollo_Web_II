import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from "react";
import { Toaster } from 'react-hot-toast'; 
import { useAuthStore } from '../store/authStore';
import Layout from '../components/layout/Layout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import TaskDetails from '../pages/dashboard/TaskDetails';
import ProtectedRoute from './ProtectedRoute';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function AppRouter() {
  const { initializeAuth, loading } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (loading) return <LoadingSpinner />;

  return (
    <BrowserRouter>
      {}
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3000,
          style: { background: '#333', color: '#fff' }
        }} 
      />
      
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks/:taskId" element={<TaskDetails />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}