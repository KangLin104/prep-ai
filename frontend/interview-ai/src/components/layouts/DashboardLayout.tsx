import { useUserContext } from '../../context/userContext';
import Navbar from './Navbar';

const DashboardLayout = ({children}:any) => {

    const {user} = useUserContext();
  return (
    <div>
        <Navbar/>
        {user && <div>{children}</div>}
    </div>
  )
}

export default DashboardLayout