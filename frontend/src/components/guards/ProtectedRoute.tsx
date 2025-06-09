import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../stores/authStore';

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // const { isAuthenticated, user } = useAuth();

  // if (!isAuthenticated) {
  //   return <Navigate to='/login' replace />;
  // }

  // if (!user?.isVerified) {
  //   return <Navigate to='/verify-email' replace />;
  // }
  return <>{children}</>;
};

export default ProtectedRoute;
