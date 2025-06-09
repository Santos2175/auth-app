import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import AppLayout from './components/layouts/AppLayout';
import ProtectedRoute from './components/guards/ProtectedRoute';
import RedirectAuthenticatedUser from './components/guards/RedirectAuthenticatedUser';
import NotFoundPage from './pages/NotFoundPage';
import DashboardPage from './pages/DashboardPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { useAuthActions, useAuthStore } from './stores/authStore';
import { useEffect } from 'react';
import LoadingSpinner from './components/ui/LoadingSpinner';

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          {/* Protected route */}
          <Route path='/' element={<DashboardPage />} />

          <Route
            path='/signup'
            element={
              <RedirectAuthenticatedUser>
                <SignupPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path='/login'
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />

          <Route path='/verify-email' element={<VerifyEmailPage />} />

          <Route
            path='forgot-password'
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />

          <Route
            path='reset-password/:token'
            element={
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />

          {/* 404 Page */}
          <Route path='/404' element={<NotFoundPage />} />

          {/* Catch all routes - redirect to 404 or home based on auth status */}
          <Route path='*' element={<Navigate to='/404' replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
