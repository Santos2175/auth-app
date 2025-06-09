import AppLayout from '../layouts/AppLayout';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <AppLayout showFloatingShape={false}>
      <div className='flex items-center justify-center'>
        <motion.div
          className='w-16 h-16 border-4 border-t-4 border-t-blue-500 border-blue-200 rounded-full'
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </AppLayout>
  );
};

export default LoadingSpinner;
