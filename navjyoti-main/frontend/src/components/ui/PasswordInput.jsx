/**
 * Password field with a show/hide toggle. Wraps the shared Input.
 */
import { forwardRef, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Input from './Input.jsx';

const PasswordInput = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      ref={ref}
      type={visible ? 'text' : 'password'}
      rightSlot={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-white"
        >
          {visible ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
      }
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
