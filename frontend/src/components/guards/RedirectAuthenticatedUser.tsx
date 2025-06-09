import { type ReactNode } from 'react';
import { useAuth } from '../../stores/authStore';
import { Navigate } from 'react-router-dom';

type RedirectedAuthenticatedUserProps = {
  children: ReactNode;
};

const RedirectAuthenticatedUser = ({
  children,
}: RedirectedAuthenticatedUserProps) => {
  // const { isAuthenticated, user } = useAuth();

  // if (isAuthenticated && user?.isVerified) {
  //   return <Navigate to='/' replace />;
  // }
  return <>{children}</>;
};

export default RedirectAuthenticatedUser;
