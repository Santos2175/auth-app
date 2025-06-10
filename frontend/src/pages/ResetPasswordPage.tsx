import { motion } from 'framer-motion';
import Input from '../components/ui/Input';
import { Lock } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

interface FormData {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { password: '', confirmPassword: '' },
  });
  const { isLoading, resetPassword } = useAuthStore();

  const { token } = useParams();
  const navigate = useNavigate();

  // Handler to reset new password
  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }

    try {
      if (token) {
        await resetPassword(token, data.password);
      }

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-md bg-gray-800/50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
      <div className='p-8'>
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text'>
          Reset Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            icon={Lock}
            type='password'
            placeholder='New Password'
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          {errors?.password && (
            <p className='text-sm text-red-400 mb-3'>
              {errors.password.message}
            </p>
          )}

          <Input
            icon={Lock}
            type='password'
            placeholder='Confirm Password'
            {...register('confirmPassword', {
              required: 'Confirm Password is required',
              validate: (value) =>
                value === getValues('password') || 'Passwords do not match',
            })}
          />
          {errors?.confirmPassword && (
            <p className='text-sm text-red-400 mb-3'>
              {errors?.confirmPassword.message}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className='w-full font-bold px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 cursor-pointer'>
            {isLoading ? 'Resetting...' : 'Set New Password'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;
