import { motion } from 'framer-motion';
import Input from '../components/ui/Input';
import { Loader, Lock, Mail, User } from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import PasswordStrengthMeter from '../components/ui/PasswordStrengthMeter';
import { useAuthStore } from '../stores/authStore';

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const password = watch('password', '');

  const { signup, isLoading } = useAuthStore();

  const navigate = useNavigate();

  // Handler to register user
  const handleSignUp = async ({
    name,
    email,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }) => {
    try {
      await signup({ name, email, password });
      navigate('/verify-email');
    } catch (error: any) {
      console.error('Error occured while signing up: ', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-md w-full bg-gray-800/50 backdrop-filter  backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
      <div className='p-8'>
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text'>
          Create Account
        </h2>

        <form onSubmit={handleSubmit(handleSignUp)}>
          <Input
            icon={User}
            type='text'
            placeholder='Full Name'
            {...register('name', { required: 'Full Name is required' })}
          />
          {errors?.name && (
            <p className='text-sm text-red-400 mb-2'>{errors?.name.message}</p>
          )}

          <Input
            icon={Mail}
            type='text'
            placeholder='Email'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors?.email && (
            <p className='text-sm text-red-400 mb-2'>{errors?.email.message}</p>
          )}

          <Input
            icon={Lock}
            type='password'
            placeholder='Password'
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          {errors?.password && (
            <p className='text-sm text-red-400 mb-2'>
              {errors?.password.message}
            </p>
          )}

          <PasswordStrengthMeter password={password} />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type='submit'
            disabled={isLoading}
            className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 cursor-pointer'>
            {isLoading ? (
              <Loader className='animate-spin mx-auto' size={24} />
            ) : (
              'Sign Up'
            )}
          </motion.button>
        </form>
      </div>

      <div className='px-8 py-4 bg-gray-900/50 flex justify-center'>
        <p className='text-sm text-gray-400'>
          Already have an account?{' '}
          <Link to={'/login'} className='text-blue-400 hover:underline'>
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignupPage;
