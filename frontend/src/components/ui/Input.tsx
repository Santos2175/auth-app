import { Eye, EyeOff, type LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
}

const Input: React.FC<InputProps> = ({ icon: Icon, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className='relative mb-6'>
      <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
        <Icon className='size-5 text-blue-500' />
      </div>
      <input
        {...props}
        type={inputType}
        className='w-full pl-10 pr-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition duration-200'
      />

      {/* If type is password */}
      {type === 'password' && (
        <div
          className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer'
          onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? (
            <Eye className='size-5 text-blue-500' />
          ) : (
            <EyeOff className='size-5 text-gray-400' />
          )}
        </div>
      )}
    </div>
  );
};

export default Input;
