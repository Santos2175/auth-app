import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const NotFoundPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className='text-center py-12'>
      <div className='mb-8'>
        <h1 className='text-9xl font-bold text-blue-500 mb-4'>404</h1>
        <h2 className='text-2xl font-semibold text-white mb-2'>
          Page Not Found
        </h2>
        <p className='text-gray-400 mb-8'>
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <Link
        to={isAuthenticated ? '/' : '/login'}
        className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'>
        {isAuthenticated ? 'Go to Dashboard' : 'Go to Login'}
      </Link>
    </div>
  );
};

export default NotFoundPage;
