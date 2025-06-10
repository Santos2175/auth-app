import { motion } from 'framer-motion';
import { useRef, useState, type FormEvent } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

const VerifyEmailPage = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const navigate = useNavigate();

  const { error, isLoading, verifyEmail } = useAuthStore();

  // Button disabled flag
  const isButtonDisabled = isLoading || code.some((digit) => !digit);

  const handleChange = (index: number, value: string) => {
    const newCode = [...code];

    // Handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || '';
      }
      setCode(newCode);

      // Fallback for ES2022: reverse + findIndex
      const reversedIndex = [...newCode]
        .reverse()
        .findIndex((digit) => digit !== '');
      const actualIndex = reversedIndex === -1 ? 0 : 5 - reversedIndex;

      const nextIndex = actualIndex < 5 ? actualIndex + 1 : 5;
      inputRefs.current[nextIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      [
        'Backspace',
        'Delete',
        'Tab',
        'Escape',
        'Enter',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
      ].includes(e.key)
    ) {
      if (e.key === 'Backspace' && !code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    // Prevent: non-numeric keys
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const verificationCode = code.join('');

    try {
      await verifyEmail(verificationCode);
      navigate('/');
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-md bg-gray-800/50 p-8 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
      <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text'>
        Verify Your Email
      </h2>
      <p className='text-center text-gray-300 mb-6'>
        Enter the 6-digit code sent to your email address.
      </p>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='flex justify-between'>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type='text'
              inputMode='numeric'
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className='h-12 w-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 '
            />
          ))}
        </div>

        {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type='submit'
          disabled={isButtonDisabled}
          className={`w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 cursor-pointer ${
            isButtonDisabled ? 'pointer-events-none ' : ''
          } `}>
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default VerifyEmailPage;
