import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { useUserContext } from '../../context/userContext';

interface SignUpProps {
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  }
const Signup: React.FC<SignUpProps> = ({setCurrentPage}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const [error, setError] = useState<string | null>(null);
  const { updateUser } = useUserContext();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName) {
      setError("Full name is required");
      return;
    }

    if (!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }

    setError("");

    try {
      
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password
      });
      console.log("Signup response:", response.data);
      const {token} = response.data;

      if (token) {
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
      <h3 className='text-lg font-semibold text-black'>Create an account</h3>

      <form onSubmit={handleSignup}>
        <div className='grid grid-cols-1 md:grid-cols-1 gap-2'>
          <Input
            value={fullName}
            onChange={({target}) => setFullName(target.value)}
            label="Full Name"
            placeholder="John Doe"
            type="text"
          />

          <Input
            value={email}
            onChange={({target}) => setEmail(target.value)}
            label="Email Address"
            placeholder="JohnDoe@email.com"
            type="text"
          />

        <Input
          value={password}
          onChange={({target}) => setPassword(target.value)}
          label="Password"
          placeholder="minimum 8 characters"
          type="password"
        />

        </div>

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary'>
          SIGN UP
        </button>

        <p className='text=[13px] text-slate-800 mt-3'>
          Have an Account?{" "}
          <button 
            className='font-medium text-primary hover:underline cursor-pointer'
            onClick={() => setCurrentPage("signup")}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  )
}

export default Signup