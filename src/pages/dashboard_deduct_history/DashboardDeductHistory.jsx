import useAuth from "../../hooks/useAuth";
import UserLogged from "../../components/UI/UserLogged";
import SideNavbar from "../../components/UI/SideNavbar";

import { Box, Typography } from "@mui/material";


import TableDeductHistory from './TableDeductHistory';


import useIsMobile from "../../hooks/useIsMobile";

export default function DashboardDeductHistory() {
  
  // Ensure the user is authenticated
  useAuth();

  const isMobile = useIsMobile();
  
  return (
    <>
      <SideNavbar/>
      {isMobile ? (<></>) : (<UserLogged/>)}
      {/* If the screen is mobile, we don't show the UserLogged component */}

      <main className={`${isMobile ? 'pl-0 py-[5vh]' : 'pl-[15vw] py-[10vh]'} mb-50 bg-[#fafafa]`}>
       
        <Typography
          sx={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: isMobile ? '3rem' : '1rem',
            color: '#333',
            textAlign: 'center',
            padding: isMobile ? '0 1rem' : '0',
            textTransform: 'uppercase',
          }}
        >Historique des déductions
        </Typography>

        
        {/* the table */}


        <TableDeductHistory/>

      </main>
    </>
  );
}