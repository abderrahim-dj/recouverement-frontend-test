import SideNavbar from "../../components/UI/SideNavbar"
import TableData from "./TableData";
import FilterCustomerForm from "./FormFilterCustomers";
import { useEffect, useState } from "react";
import UserLogged from "../../components/UI/UserLogged";

import { Typography } from "@mui/material";
//my custom authHook
import useAuth from '../../hooks/useAuth';



import useIsMobile from "../../hooks/useIsMobile";


export default function DashboardStatic () {

  const isMobile = useIsMobile();

  const [dataFilter, setDataFilter] = useState();
  const [isLoadinFilter, setIsloadinFIlter] = useState(false);
  
  const handleDataFeromChild1 = (data) => {
    setDataFilter(data);
    console.log('data get', data);
    console.log('isLoadinFilter', isLoadinFilter);
    
    
  };

  //my custom hook to check if the user is authenticated or not
  useAuth();


  return (

    <>
      <SideNavbar/>

        {isMobile ? (<></>) : (<UserLogged/>)}
        <main className={`${isMobile ? 'ml-0' : 'ml-[15vw]'} ${isMobile ? 'pt-[5vh]' : 'pt-[10vh]'} flex flex-col gap-8 justify-center items-center mb-50 bg-[#fafafa]`}>

          <Typography sx={{
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: isMobile ? '3rem' : '1rem',
            textTransform: 'uppercase',
          }}>List des clients</Typography>
          

          {/* <FilterCustomerForm sendDataToParent={handleDataFeromChild1} waiting={setIsloadinFIlter} /> */}
          <TableData receivedData={dataFilter} waiting={isLoadinFilter}/>

      </main>
    
    </>
  )
}