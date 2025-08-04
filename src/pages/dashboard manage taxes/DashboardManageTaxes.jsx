import useAuth from "../../hooks/useAuth";
import UserLogged from "../../components/UI/UserLogged";
import SideNavbar from "../../components/UI/SideNavbar";


import { Typography } from "@mui/material";
//table
import TableListOfTaxes from "./TableListOfTaxes";


import useIsMobile from "../../hooks/useIsMobile";

export default function DashboardManageTaxes() {
  // check the user authentication
  useAuth();
  
  const isMobile = useIsMobile();
  
  return (
    <>
      <SideNavbar/>
      {isMobile ? (<></>) : (<UserLogged />)}
      <main className={`${isMobile ? 'pl-0 pt-[5vh]'  : 'pl-[15vw] pt-[10vh]'}  flex flex-col mb-50 bg-[#fafafa]`}>
        <Typography
        sx={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: isMobile ? '3rem' : '3rem',
            color: '#333',
            textAlign: 'center',
            textTransform: 'uppercase',
            
        }}
        >Gestion des taxes</Typography>

        
        
        {/* the table  */}
        <TableListOfTaxes />
      </main>
    </>
  );
}