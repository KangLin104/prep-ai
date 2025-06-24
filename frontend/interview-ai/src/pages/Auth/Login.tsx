import React, { useState } from 'react'
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/userContext';

interface LoginProps {
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  }

const Login: React.FC<LoginProps> = ({setCurrentPage}) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { updateUser } = useUserContext();

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }

    if (!password){
      setError("Password is required");
      return;
    }

    setError("");

    try {
      
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });

      const { token } = response.data;
      
      if (token) {
        console.log("Login response:", response.data);
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
      
    } catch (error: any) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || "An error occurred during login.");
      }
      else {
        setError("An unexpected error occurred.");
      }
    }
  }
  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'> Login to Account</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>Enter detail to login</p>

      <form className='' onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={({target}) => setEmail(target.value)}
          label="Email Address"
          placeholder="john@email.com"
          type="text"
        />

        <Input
          value={password}
          onChange={({target}) => setPassword(target.value)}
          label="Password"
          placeholder="minimum 8 characters"
          type="password"
        />
        
        { error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary'>
          Login
        </button>

        <p className='text=[13px] text-slate-800 mt-3'>
          Dont have an account?{" "}
          <button 
            className='font-medium text-primary hover:underline cursor-pointer'
            onClick={() => setCurrentPage("signup")}
          >
            Sign Up
          </button>
        </p>

      </form>
    </div>
  )
}

export default Login