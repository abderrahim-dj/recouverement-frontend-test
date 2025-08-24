import SideNavbar from "../../components/UI/SideNavbar";
import UserLogged from "../../components/UI/UserLogged";
import { Typography, Box } from "@mui/material";
import useAuth from "../../hooks/useAuth";

//import the table 
import TableCustomerWaitingForValidation from "./TableCustomerWaitingForVallidation";

import useIsMobile from "../../hooks/useIsMobile";

export default function DashboardCustomerWaitingForValidation() {
  
  const isMobile = useIsMobile();

  useAuth();
  
  return (
    <>
      <SideNavbar/>
      {isMobile ? (<></>) : (<UserLogged/>)}
      <main className={`${isMobile ? 'pl-0 py-[5vh]' : 'pl-[15vw] py-[10vh]'} mb-50 bg-[#fafafa]`}>
          <Typography sx={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: isMobile ? '3rem' : '1rem',
            color: '#333',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}>Clients en attente de validation</Typography>
          
          {/* the Table */}
          <TableCustomerWaitingForValidation/>

      </main>
    </>
  );
}