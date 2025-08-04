import SideNavbar from "../../components/UI/SideNavbar"
import DashboardHomeCardUser from "../../components/UI/DashbordHomeCardUser"
import DashbordHomeCardMoney from "../../components/UI/DashbordHomeCardMoney"
import { Box, Grid, Typography } from "@mui/joy"
import { use, useEffect, useState } from "react"
import ModalCard from '../../components/UI/ModalCard'
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';

import ChartMoney from "./ChatMoney"
import ChartClient from './ChartClient'


//get customers status from database
import getCustomersStatus from "../../services/getCustomersStatus"

import UserLogged from "../../components/UI/UserLogged"

//my custom authHook
import useAuth from '../../hooks/useAuth';


//my custom hook to get the customers status and loading state while fetching
import useGetCustomerStatus from "../../hooks/useGetCustomerStatus";

//get the account money collected
import useAccountMoneyCollected from "../../services/getAccountMoneyCollected"


import useIsMobile from "../../hooks/useIsMobile"



export default function DashboardHome () {


  const isSuperuser = localStorage.getItem('is_superuser') === 'true' ? true : false;


  const {customersData, isLoading, error} = useGetCustomerStatus();
  const {UsersData, isLoading: isLoadingMoneyCollected, error: errorMoneyCollected} = useAccountMoneyCollected(localStorage.getItem('user_id'));


  console.log('error: ', error);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (error) {
      console.error('Error fetching customers status:', error);
      setShowModal(true);
    }
  }, [error]);
  



  //my custom hook to check if the user is authenticated or not
  useAuth();

  const isMobile = useIsMobile();

  return (
    <>
    {isMobile ? (
      <>
      <main className="flex flex-col gb-[#fafafa]">
          
          {/* main side navbar */}
          <SideNavbar/>
          

          {/* main content */}
          
          <Box className='flex flex-col'>
            <Box sx={{ 
              paddingX:5,
              paddingTop: isMobile ? '5vh' :'10vh',
              display:'flex', 
              flexDirection:'column', 
              flex: 1, 
              marginBottom: '5vh'
              }}>
            
              {/* main title */}
              <Typography sx={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#333',
                textAlign: 'center',
                textTransform: 'uppercase',
              }}>Tableau de bord</Typography>

              <Box sx={{display: 'flex', flexDirection:'column', marginBottom:'5vh', marginTop:4}}>
                
                {/* users card */}
                <Grid container spacing={4} justifyContent="center">
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <DashboardHomeCardUser
                      title={'Nombre total de clients'}
                      number={customersData ? customersData.total_customers : undefined}
                      isLoading={isLoading}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <DashboardHomeCardUser
                      title={'Clients endettés'}
                      number={customersData ? customersData.customers_not_paid_all_apport : undefined}
                      isLoading={isLoading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <DashboardHomeCardUser
                      title={'Clients sans dette'}
                      number={customersData ? customersData.customers_paid_all_apport : undefined}
                      isLoading={isLoading}
                    />
                  </Grid>
                </Grid>

                {/* money card */}
                <Grid container spacing={4} justifyContent="center" sx={{ marginTop: 2 }}>
                  {isSuperuser ? (
                    <>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <DashboardHomeCardUser
                          title={
                            <>
                              Clients en attente <br/> de validation
                            </>
                          }
                          number={customersData ? customersData.customerWaitingForValidation : undefined}
                          isLoading={isLoading}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <DashboardHomeCardUser
                          title={'Clients validés'}
                          number={customersData ? customersData.customerValidated : undefined}
                          isLoading={isLoading}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <DashbordHomeCardMoney
                          title={'Montant collecté'}
                          amount={UsersData ? Number(UsersData.balance) : undefined} 
                          isLoading={isLoadingMoneyCollected}
                        />
                      </Grid>
                    </>
                  ) : (
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <DashbordHomeCardMoney
                        title={'Montant collecté'}
                        amount={UsersData ? Number(UsersData.balance) : undefined} 
                        isLoading={isLoadingMoneyCollected}
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>




            </Box>

            {/* charts */}
            {/* <Box className='ml-[15vw] pt-20 pb-50'>
              <Box sx={{display:'flex', justifyContent:'space-evenly', marginTop:'5vh'}}>
                <ChartMoney/>
                <ChartClient/>
              </Box>
            </Box> */}
          </Box>



        </main>
      </>
    ):
    (
      <>
    
        <main className="flex flex-col">
          
          {/* main side navbar */}
          <SideNavbar/>
          
          {/* user Logged */}

          <UserLogged/>

          {/* main content */}
          
          <Box className='flex flex-col mb-50'>
            <Box sx={{paddingLeft:'15vw', paddingTop: '10vh',display:'flex', flexDirection:'column', flex: 1}}>
            
              {/* main title */}
              <Typography sx={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#333',
                textAlign: 'center',
                textTransform: 'uppercase',
              }}>Tableau de bord</Typography>

              <Box sx={{display: 'flex', flexDirection:'column', marginTop:'5vh'}}>
                
                {/* users card */}
                <Grid container spacing={4} justifyContent="center">
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <DashboardHomeCardUser
                      title={'Nombre total de clients'}
                      number={customersData ? customersData.total_customers : undefined}
                      isLoading={isLoading}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <DashboardHomeCardUser
                      title={'Clients endettés'}
                      number={customersData ? customersData.customers_not_paid_all_apport : undefined}
                      isLoading={isLoading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <DashboardHomeCardUser
                      title={'Clients sans dette'}
                      number={customersData ? customersData.customers_paid_all_apport : undefined}
                      isLoading={isLoading}
                    />
                  </Grid>
                </Grid>

                {/* money card */}
                <Grid container spacing={4} justifyContent="center" sx={{ marginTop: '3rem' }}>
                  {isSuperuser ? (
                    <>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <DashboardHomeCardUser
                          title={
                            <>
                              Clients en attente <br/> de validation
                            </>
                          }
                          number={customersData ? customersData.customerWaitingForValidation : undefined}
                          isLoading={isLoading}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <DashboardHomeCardUser
                          title={'Clients validés'}
                          number={customersData ? customersData.customerValidated : undefined}
                          isLoading={isLoading}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <DashbordHomeCardMoney
                          title={'Montant collecté'}
                          amount={UsersData ? Number(UsersData.balance) : undefined} 
                          isLoading={isLoadingMoneyCollected}
                        />
                      </Grid>
                    </>
                  ) : (
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <DashbordHomeCardMoney
                        title={'Montant collecté'}
                        amount={UsersData ? Number(UsersData.balance) : undefined} 
                        isLoading={isLoadingMoneyCollected}
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>




            </Box>

            {/* charts */}
            {/* <Box className='ml-[15vw] pt-20 pb-50'>
              <Box sx={{display:'flex', justifyContent:'space-evenly', marginTop:'5vh'}}>
                <ChartMoney/>
                <ChartClient/>
              </Box>
            </Box> */}
          </Box>



        </main>
      </>
    )}

    <ModalCard
      title={'Impossible de récupérer les données'}
      showModal={showModal} 
      setShowModal={setShowModal} 
      icon={<ReportGmailerrorredOutlinedIcon fontSize="large"/>} 
      color={'danger'}
    />
    </>

  )
}


















// is is the old code for the dashboard home page that shows the cards
// {/* card */}
// <Box sx={{display: 'flex', flexDirection:'column', marginTop:'20vh'}}>
  
//   {/* users card */}
//   <Box sx={{
//     display:'flex', justifyContent:'space-evenly', //paddingX:'10rem'
//   }}>

//     <DashboardHomeCardUser
//       title={'Nombre total de clients'}
//       number={customersData ? customersData.total_customers : undefined}
//       isLoading={isLoading}
//     />

//     <DashboardHomeCardUser
//       title={'Clients endettés'}
//       number={customersData ? customersData.customers_not_paid_all_apport : undefined}
//       isLoading={isLoading}
//     />
    
//     <DashboardHomeCardUser
//       title={'Clients sans dette'}
//       number={customersData ? customersData.customers_paid_all_apport : undefined}
//       isLoading={isLoading}
//     />
//   </Box>

//   {/* money card */}

//   <Box sx={{display:'flex', justifyContent:isSuperuser ? 'space-evenly' : 'center', gap:'6rem', marginTop: '3rem'}}>
    
//     {/* 
//     <DashbordHomeCardMoney 
//       title={'Montant total reçu'}
//       amount={customersData ? customersData.total_paid : undefined}  
//       isLoading={isLoading}
//     />
//     */}
//     {/*               
//     <DashbordHomeCardMoney
//       title={'Montant restant'}
//       amount={customersData ? Number(customersData.total_paid_left) : undefined} 
//       isLoading={isLoading}
//     /> */}



//     { isSuperuser && (
//       <>
//         <DashboardHomeCardUser
//           title={
//             <>
//               Clients en attente <br/> de validation
//             </>
//           }
//           number={customersData ? customersData.customerWaitingForValidation : undefined}
//           isLoading={isLoading}
//         />
        
//         <DashboardHomeCardUser
//           title={'Clients validés'}
//           number={customersData ? customersData.customerValidated : undefined}
//           isLoading={isLoading}
//         />
//       </>
//     )}


//     <DashbordHomeCardMoney
//       title={'Montant collecté'}
//       amount={UsersData ? Number(UsersData.balance) : undefined} 
//       isLoading={isLoadingMoneyCollected}
//     />
//   </Box>
  
// </Box>