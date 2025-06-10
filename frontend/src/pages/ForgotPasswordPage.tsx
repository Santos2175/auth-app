import { motion } from 'framer-motion';
import { useState } from 'react';
import Input from '../components/ui/Input';
import { ArrowLeft, Loader, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useForm } from 'react-hook-form';

interface FormData {
  email: string;
}

const ForgotPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: { email: '' } });

  const { isLoading, forgotPassword } = useAuthStore();

  const onSubmit = async ({ email }: FormData) => {
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      setSubmittedEmail(email);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-md  bg-gray-800/50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
      <div className='p-8'>
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-cyan-600 text-transparent bg-clip-text'>
          Forgot Password
        </h2>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <p className='text-gray-300 mb-6 text-center'>
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

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
              <p className='text-sm text-red-400 mb-3'>
                {errors?.email.message}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className='w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 cursor-pointer'>
              {isLoading ? (
                <Loader size={24} className='animate-spin mx-auto' />
              ) : (
                'Send Reset Link'
              )}
            </motion.button>
          </form>
        ) : (
          <div className='text-center'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className='w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Mail className='h-8 w-8 text-white' />
            </motion.div>
            <p className='text-gray-300 mb-6'>
              If an account exists for {submittedEmail}, you will receive a
              password reset link shortly.
            </p>
          </div>
        )}
      </div>
      <div className='px-8 py-4 bg-gray-900/50 flex justify-center'>
        <Link
          to={'/login'}
          className='text-sm text-blue-400 hover:underline flex items-center'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back to Login
        </Link>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
