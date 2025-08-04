import useAuth from "../../hooks/useAuth";
import SideNavbar from "../../components/UI/SideNavbar";
import UserLogged from "../../components/UI/UserLogged";

import FormSendingMoney from "./FormSendingMoney";
import { CircularProgress, Typography } from "@mui/material";

import useAccountMoneyCollected from "../../services/getAccountMoneyCollected";

import WifiProtectedSetupOutlinedIcon from '@mui/icons-material/WifiProtectedSetupOutlined';

import useIsMobile from "../../hooks/useIsMobile";


export default function DashBoardSendMoney() {
  //check of the authentication
  useAuth();

  const isMobile = useIsMobile();

  // get the user balance form backend
  const {UsersData, isLoading} = useAccountMoneyCollected(localStorage.getItem('user_id'));
  

  return (
    <>
    
    <SideNavbar/>

    {isMobile ? (<></>) : (<UserLogged/>)}
      <main className={`${isMobile ? 'ml-0 pt-[5vh]' : 'ml-[15vw] pt-[10vh]'} bg-[#fafafa]  mb-50 flex flex-col`}>
        <Typography
        
          sx={{
            px: 2,
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: isMobile ? '3rem' : '3rem',
            color: '#333',
            textAlign: 'center',
            textTransform: 'uppercase',
          }} 
           
          //className="size-[2rem] font-bold text-center mb-5"
          > 
          {/* <WifiProtectedSetupOutlinedIcon fontSize="inherit" sx={{mr:1}}/> */}
          
          Envoyer de l'argent
        </Typography>

        
        <Typography sx={{
          textAlign: 'center',
          fontSize: '1.2rem',
          fontWeight: 'bold',
        }}>
          Votre solde actuel est de {isLoading ? (
            <CircularProgress size={'1.2rem'}/>
          ) : (
            <span className="text-green-500">{Number(UsersData?.balance)} DA</span>
          )}
        </Typography>

          <FormSendingMoney userBalance={UsersData?.balance}/>
        
      </main>
    </>
  );
}