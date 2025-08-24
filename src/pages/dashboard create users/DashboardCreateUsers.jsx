//this page is for the super user to craete new users (workers) and set thier roles (post)
import SideNavbar from "../../components/UI/SideNavbar";
import useAuth from "../../hooks/useAuth";
import UserLogged from "../../components/UI/UserLogged";
import { Typography } from "@mui/material";

import FormCreateUsers from "./FormCreateUsers";
import useIsMobile from "../../hooks/useIsMobile";


export default function DashboardCreateUsers(){
  
  //check the authentication of the user
  useAuth();

  const isMobile = useIsMobile();
  
  
  return (
    <>
    {isMobile ? (
    // for the mobile view
    <>
      <SideNavbar />

      <main className={`pt-[5vh] flex flex-col mb-50`}>
        <Typography
          sx={{
            px: 2,
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '3rem',
            color: '#333',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >Créer des utilisateurs
        </Typography>


        {/* Add your content here */}

        <FormCreateUsers/>
      </main>
    </>)
     : 
    //  for the desktop view
     (
      <>
        <SideNavbar />
        <UserLogged />


        <main className="pl-[15vw] pt-[10vh] flex flex-col">
          <Typography
            sx={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '3rem',
              color: '#333',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >Créer des utilisateurs
          </Typography>


          {/* Add your content here */}

          <FormCreateUsers/>
        </main>
      </>
    )}
    </>
  );
}