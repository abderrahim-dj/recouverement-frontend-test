import useAuth from "../../hooks/useAuth";
import SideNavbar from "../../components/UI/SideNavbar";
import UserLogged from "../../components/UI/UserLogged";

import { Typography } from "@mui/material";
import TableListOfUsers from "./TableListOfUsers";

import useIsMobile from "../../hooks/useIsMobile";


export default function DashboardListOfUsers() {
 
 // Check if the user is authenticated
 useAuth();
 const isMobile = useIsMobile()


  return (
    <>

      <SideNavbar />
      {isMobile ? (<></>) : (<UserLogged />)}
      <main className={`${isMobile ? 'pl-0 py-[5vh]' : 'pl-[15vw] py-[10vh]'} mb-50 flex flex-col bg-[#fafafa]`}>
        <Typography
           sx={{
            px: 2,
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: isMobile ? '3rem' : '1rem',
            color: '#333',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >Liste des utilisateurs</Typography>
        
        
        {/* Table */}
        <TableListOfUsers/>
      </main>
    </>
  );
}