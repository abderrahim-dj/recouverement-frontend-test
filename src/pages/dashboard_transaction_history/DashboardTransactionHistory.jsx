import SideNavbar from "../../components/UI/SideNavbar";
import TableTeransactionHistory from "./TableTransactionHistory";
import UserLogged from "../../components/UI/UserLogged";
import { Typography, Box } from "@mui/material";
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import useAuth from "../../hooks/useAuth";

import useIsMobile from "../../hooks/useIsMobile";


export default function DashboardTransactionHistory() {
  
  //check authentication
  useAuth();
  const isMobile = useIsMobile();

  return (
    <>
      <SideNavbar/>
      {isMobile ? (<></>) : (<UserLogged/>)}
      <main className={`${isMobile ? 'pl-0 py-[5vh]' : 'pl-[15vw] py-[10vh]'} mb-50 bg-[#fafafa]`}>
          <Typography sx={{
            px: 2,
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: isMobile ? '3rem' : '3rem',
            color: '#333',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}>Historique des transactions {/* <HistoryOutlinedIcon fontSize="inherit"/> */}</Typography>
          
          {/* the Table */}
        <TableTeransactionHistory/>
      </main>
    </>
  );
}