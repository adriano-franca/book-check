import { useAuthStore } from '@/app/stores/authStore';
import { Navigate, Outlet } from 'react-router-dom'

export function ProtectedRoute() {
  const { token: isAuthenticated } = useAuthStore();
  
  return isAuthenticated || 1 ? <Outlet /> : <Navigate to="/login" replace />
}
