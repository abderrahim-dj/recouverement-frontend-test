import useAuth from "../../hooks/useAuth";
import useAccountMoneyCollected from "../../services/getAccountMoneyCollected";

import { useState, useEffect } from "react";

import SideNavbar from "../../components/UI/SideNavbar";
import FormDeductAmount from "./FormDeductAmount";
import UserLogged from "../../components/UI/UserLogged";


import { Typography, Box, CircularProgress } from "@mui/material";


import useIsMobile from "../../hooks/useIsMobile";

export default function DashboardDeductAmount() {
  
  // Ensure the user is authenticated
  useAuth();

  const isMobile = useIsMobile();
  

  const [userBalance, setUserBalance] = useState(0);

  const {UsersData, isLoading: isLoaindUserAmount} = useAccountMoneyCollected(localStorage.getItem('user_id'));

  useEffect(() => {
    if(UsersData){
      setUserBalance(UsersData.balance);
    }
  }, [UsersData]);


  return (

    <>
    <SideNavbar/>

    {isMobile ? (<></>) : (<UserLogged/>)}
    

      <main className={`dashboard-deduct-amount ${isMobile ? 'pl-0 py-[5vh]' : 'pl-[15vw] py-[10vh]'} bg-[#fafafa] mb-50`}>
        <Typography sx={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: isMobile ? '3rem' : '1rem',
          color: '#333',
          textAlign: 'center',
          textTransform: 'uppercase',
        }}
        >Déduire le montant
        </Typography>

        <Typography
        sx={{
          textAlign: 'center',
          fontSize: '1.2rem',
          fontWeight: 'bold',
        }}
        >
          Votre solde actuel est de {isLoaindUserAmount ? (
            <CircularProgress size={'1.2rem'}/>
          ) : (
            <span className="text-green-500">{Number(userBalance)} DA</span>
          )}
        </Typography>



        {/* Add your components and logic here */}

        {/* form for deduct the amount */}
        <Box className=' mt-[4rem] flex justify-center items-center'>
          <FormDeductAmount currentAmount={userBalance} setUserBalance={setUserBalance} />
        </Box>
      
      </main>
    </>
  );
}