import { useNavigate } from "react-router-dom";

export function useLogout() {

  const navigate = useNavigate();

  const performLogout = () => {
    console.log('logging out ...');
    
    //remove from the local storage
    localStorage.clear();
    
    /* 
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('is_superuser');
    localStorage.removeItem('is_staff');
    localStorage.removeItem('is_active');
    localStorage.removeItem('user_id');
    localStorage.removeItem('first_name');
    localStorage.removeItem('last_name');
    localStorage.removeItem('expandPayList');
    localStorage.removeItem('expandSendMoneyList');
   */
    navigate('/login');
  }
  return performLogout;

}


export default useLogout;



