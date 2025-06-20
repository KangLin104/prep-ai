import React, {useState} from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

interface InputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    placeholder?: string;
    type?: string;
  }
  

const Input: React.FC<InputProps> = ({ value, onChange, label, placeholder, type}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    return (
    <div>
        <label className=''> {label}</label>

        <div className='input-box'>
            <input
                className='w-full bg-transparent outline-none'
                type = {
                    type === 'password' ? (showPassword ? 'text' : 'password') : type
                }
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e)}
            />

            {type === 'password' && (
                <>
                    {showPassword ? (
                        <FaRegEye
                            size={22}
                            className='text-primary cursor-pointer'
                            onClick={() => togleShowPassword()}
                        />
                    ) : (
                        <FaRegEyeSlash 
                            size={22}
                            className='text-slate-400 cursor-pointer'
                            onClick={() => togleShowPassword()}/>
                    )}
                </>
            )}
        </div>
    </div>
  )
}

export default Input