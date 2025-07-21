import React, {useContext} from 'react'
import { UserContext } from '../../context/userContext';
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