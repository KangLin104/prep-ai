import { useUserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';


const ProfileInfoCard = () => {

    const {user, clearUser} = useUserContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/");
    }
    

  return (
    user && (
    <div className='flex items-center'>
        <div>
            <div className='text-[15px] font-bold text-black leading-3'>
                {user?.name || ""}
            </div>

            <button
                className='text-amber-600 text-sm font-semibold cursor-pointer hover:underline'
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    </div>
  ))
}

export default ProfileInfoCard