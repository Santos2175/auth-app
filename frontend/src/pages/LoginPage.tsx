import { motion } from 'framer-motion';
import Input from '../components/ui/Input';
import { Loader, Lock, Mail } from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useForm } from 'react-hook-form';

interface FormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const navigate = useNavigate();

  const { login, isLoading } = useAuthStore();

  const handleLogin = async ({ email, password }: FormData) => {
    try {
      await login({ email, password });
      navigate('/');
    } catch (error: any) {
      if (error?.status === 403) {
        navigate('/verify-email');
        return;
      }
      console.error(error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-md bg-gray-800/50  backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
      <div className='p-8'>
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-cyan-600 text-transparent bg-clip-text'>
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit(handleLogin)}>
          <Input
            icon={Mail}
            type='text'
            placeholder='Email Address'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors?.email && (
            <p className='text-sm text-red-400 mb-2'>{errors.email.message}</p>
          )}

          <Input
            icon={Lock}
            type='password'
            placeholder='Password'
            {...register('password', { required: 'Password is required' })}
          />
          {errors?.password && (
            <p className='text-sm text-red-400 mb-2'>
              {errors.password.message}
            </p>
          )}

          <div className='flex items-center mb-6'>
            <Link
              to='/forgot-password'
              className='text-sm text-blue-400 hover:underline'>
              Forgot password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            type='submit'
            className='w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 cursor-pointer'>
            {isLoading ? (
              <Loader className='animate-spin mx-auto' size={24} />
            ) : (
              'Login'
            )}
          </motion.button>
        </form>
      </div>

      <div className='px-8 py-4 bg-gray-900/50 flex justify-center'>
        <p className='text-sm text-gray-400'>
          Don't have an account?{' '}
          <Link to={'/signup'} className='text-blue-400 hover:underline'>
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
