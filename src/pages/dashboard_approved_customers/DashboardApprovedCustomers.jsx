import SideNavbar from "../../components/UI/SideNavbar";
import UserLogged from "../../components/UI/UserLogged";
import { Typography, Box } from "@mui/material";
import useAuth from "../../hooks/useAuth";

//import the table
import TableCustomerApproved from "./TableCustomerApporved";


import useIsMobile from "../../hooks/useIsMobile";


export default function DashboardApprovedCustomers() {


  const isMobile = useIsMobile()

  useAuth();
  return (
    <>
      <SideNavbar/>
      
      { isMobile ? (<></>) : (<UserLogged/>)}
      <main className={`${isMobile ? 'pl-0 py-[5vh]' : 'pl-[15vw] py-[10vh]'} mb-50 bg-[#fafafa]`}>
          <Typography sx={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: isMobile ? '3rem' : '1rem',
            color: '#333',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}>Clients validés</Typography>
          
          {/* the Table */}
          <TableCustomerApproved/>

      </main>
    </>
  );
}