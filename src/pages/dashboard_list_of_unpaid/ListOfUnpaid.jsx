import SideNavbar from "../../components/UI/SideNavbar";
import TableInCompletePaid from "./TableInCompletePaid";
import useAuth from "../../hooks/useAuth";
import { use } from "react";
import UserLogged from "../../components/UI/UserLogged";
import { Typography } from "@mui/material";


import useIsMobile from "../../hooks/useIsMobile";


export default function ListOfUnpaid() {

  
  const isMobile = useIsMobile();
  useAuth();
  
  
  return (
    <>
      <SideNavbar />

      {isMobile ? (<></>) : (<UserLogged/>)}
      <main className={`${isMobile ? 'pl-0 py-[5vh]' : 'pl-[15vw] py-[10vh]'} mb-50 bg-[#fafafa]`}>
        <Typography sx={{
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: isMobile ? '3rem' : '1rem',
          textTransform: 'uppercase',
        }}>Paiements incomplets</Typography>
        
        <TableInCompletePaid />

   
        
      </main>
    </>
  );
}