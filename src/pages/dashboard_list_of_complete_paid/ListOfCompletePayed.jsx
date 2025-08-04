import SideNavbar from "../../components/UI/SideNavbar";
import TableCompletePaid from "./TableCompletePaid";
import useAuth from "../../hooks/useAuth";
import UserLogged from "../../components/UI/UserLogged";

import { Typography } from "@mui/material";

import useIsMobile from "../../hooks/useIsMobile";


export default function ListOfCompletePayed() {
  
  useAuth();

  const isMobile = useIsMobile();
  
  return (
    <>
      <SideNavbar/>
      {isMobile ? (<></>) : (<UserLogged/>)}

      
      {/* main content */}
      <main className={`${isMobile ? 'pl-0 py-[5vh]' : 'pl-[15vw] py-[10vh]'} mb-50 bg-[#fafafa]`}>
        <Typography sx={{
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: isMobile ? '3rem' : '1rem',
          textTransform: 'uppercase',
        }}>Paiements effectués</Typography>
        <TableCompletePaid/>
      </main>
    </>
  );
}