import useAuth from "../../hooks/useAuth";
import SideNavbar from "../../components/UI/SideNavbar";
import UserLogged from "../../components/UI/UserLogged";



import { Typography } from "@mui/material";

//the table 
import TableDashbordEmpleyeeTransaction from "./TableDashbordEmpleyeeTransaction";


import useIsMobile from "../../hooks/useIsMobile";



export default function DashboardEmpleyeeTransaction(){
  
  // check if the user is authenticated
  useAuth();

  const isMobile = useIsMobile();
 
  return (

    <>
    { isMobile ? (
      
      <>
      <SideNavbar/>

        <main className=" py-[5vh] bg-[#fafafa] mb-50">
          <Typography 
            sx={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '3rem',
              color: '#333',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          className="text-2xl font-bold mb-4">Transactions des employés</Typography>


          <TableDashbordEmpleyeeTransaction/>
        </main>
    
    
      </>) : (
      
      <>
        <SideNavbar/>
        <UserLogged/>

        <main className="pl-[15vw] py-[10vh] bg-[#fafafa]">
          <Typography 
            sx={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#333',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          className="text-2xl font-bold mb-4">Transactions des employés</Typography>


          <TableDashbordEmpleyeeTransaction/>
        </main>
      </>
    )}
    </>
  );
}