
//for the overall imort structure of the file 
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';


//for the derawer
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';


import { Tooltip, Collapse, } from "@mui/material";



//importing the icons
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import WifiProtectedSetupOutlinedIcon from '@mui/icons-material/WifiProtectedSetupOutlined';
import RepeatOutlinedIcon from '@mui/icons-material/RepeatOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import RecentActorsOutlinedIcon from '@mui/icons-material/RecentActorsOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import DeviceHubOutlinedIcon from '@mui/icons-material/DeviceHubOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import FmdGoodRoundedIcon from '@mui/icons-material/FmdGoodRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';


import { ExpandLess, ExpandMore } from "@mui/icons-material";


import img from '/groupe_diar_dzair.png'

// Importing the logout hook
import useLogout from '../../hooks/useLogout';


//imprting the modal
import ModalCard from '../UI/ModalCard'


//importing modal to show the customer details
import CustomerDetails from '../../pages/dashboard_static/CustomerDetails';

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';



//funciton to search users
import searchUsers from '../../services/searchUsers';



export default function MobileSideNavbar() {


  const user_first_name = localStorage.getItem('first_name') || 'User';
  const user_last_name = localStorage.getItem('last_name') || 'Name';


  const logout = useLogout();



  //logic for openning and closing menu items
  //for the list expansion for payments
  const [expandPayList, setExpandPayList] = useState(() => {
    // Try to get from localStorage, fallback to false
    const stored = localStorage.getItem('expandPayList');
    return stored === 'true' ? true : false;
  });


  //for the list expansion for clients
  const [expandClientList, setExpandClientList] = useState(() => {
    // Try to get from localStorage, fallback to false
    const stored = localStorage.getItem('expandClientList');
    return stored === 'true' ? true : false;
  });



  //for the list expansion for payments
  const [expandSendMoneyList, setExpandSendMoneyList] = useState(() => {
    // Try to get from localStorage, fallback to false
    const stored = localStorage.getItem('expandSendMoneyList');
    return stored === 'true' ? true : false;
  });  
  
  
  //for the list expansion for payments
  const [expandWorkerManaging, setExpandWorkerManaging] = useState(() => {
    // Try to get from localStorage, fallback to false
    const stored = localStorage.getItem('expandWorkerManaging');
    return stored === 'true' ? true : false;
  });



  const navigate = useNavigate();
  const location = useLocation();





  //state for the search bar
  const [isSearching, setIsSearching] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState()
  const [showResults, setShowResults] = useState(false)

  //for customer detail
  const [showCustomerDetails,  setShowCustomerDetails] = useState()
  const [customerData, setCustomerData] = useState()



  //function to handle opening and closing the list of payments
  const hanldeExpandList = () => {
    setExpandPayList((prev)=> !prev);
  }

  useEffect(() => {
    // Save expandList state to localStorage whenever it changes
    localStorage.setItem('expandPayList', expandPayList);
  }, [expandPayList])

  useEffect(() => {
    const paymentRoutes = ['/pay', '/complet', '/incomplet', '/print-check'];
    // Only open if navigating to a payment route and it's currently closed
    if (paymentRoutes.includes(location.pathname) && !expandPayList) {
      setExpandPayList(true);
    }
    // Never auto-close
    // eslint-disable-next-line
  }, [location.pathname]);
  
  


  //function to handle opening and closing the list of clients
  const handleExpandClientList = () => {
    setExpandClientList((prev)=> !prev);
  }

  useEffect(() => {
    // Save expandList state to localStorage whenever it changes
    localStorage.setItem('expandClientList', expandClientList);
  }, [expandClientList])

  useEffect(() => {
    const paymentRoutes = ['/new-customer', '/static', '/customers-waiting-validation', '/customers-approved', '/Clients-encaisses', '/Clients-encaisses-all'];
    // Only open if navigating to a payment route and it's currently closed
    if (paymentRoutes.includes(location.pathname) && !expandClientList) {
      setExpandClientList(true);
    }
    // Never auto-close
    // eslint-disable-next-line
  }, [location.pathname]);
    
    
  
    
  

  //function to handle opening and closing the list of sending money
  const hanldelExpandSendMoneyList = () => {
    setExpandSendMoneyList((prev)=> !prev);
  }


  useEffect(() => {
    // Save expandList state to localStorage whenever it changes
    localStorage.setItem('expandSendMoneyList', expandSendMoneyList);
  }, [expandSendMoneyList])




  useEffect(() => {
    const transactionRoutes = ['/send-money', '/transaction-history', '/transaction-action', '/deduct-balance-action', '/deduct-balance-history', '/employee-transactions'];
    // Only open if navigating to a payment route and it's currently closed
    if (transactionRoutes.includes(location.pathname) && !expandSendMoneyList) {
      setExpandSendMoneyList(true);
    }
    // Never auto-close
    // eslint-disable-next-line
  }, [location.pathname]);

  



  //function to handle opening and closing the list of sending money
  const hanldelWorkerManaging = () => {
    setExpandWorkerManaging((prev)=> !prev);
  }


  useEffect(() => {
    // Save expandList state to localStorage whenever it changes
    localStorage.setItem('expandWorkerManaging', expandWorkerManaging);
  }, [expandWorkerManaging])


  useEffect(() => {
    const workerManagingtRoutes = ['/workers-create', '/workers-list'];
    // Only open if navigating to a payment route and it's currently closed
    if (workerManagingtRoutes.includes(location.pathname) && !expandWorkerManaging) {
      setExpandWorkerManaging(true);
    }
    // Never auto-close
    // eslint-disable-next-line
  }, [location.pathname]);


  //function to handle the search
    const handleSearch = async () => {
      if (!searchTerm.trim() === '') return;
  
      setIsSearching(true);
      try{
        const results = await searchUsers(searchTerm);
        if (results) {
          setSearchResults(results)
          setShowResults(true);
          
        }
      }catch (error) {
        console.log('Error searching users:', error);
      }finally {
        setTimeout(() => {
          setIsSearching(false)
        }, 500);
      }
    }
  
    //handle key peress for enter key
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSearch();
      }
    }
    
    //handle going to the payment page
    const handlePaymentAction = (customer) => {
      
      const payUrl = `/pay?id=${customer.customer_id}&name=${encodeURIComponent(`${customer.customer_firstname} ${customer.customer_lastname} | ${customer.customer_id}`)}`;
      
      //check if the current location is /pay
      if (location.pathname === '/pay') {
        //force a full reload
        navigate(`${payUrl}&_=${Date.now()}`);
  
      }
      //noraml navigation
      else {
        navigate(payUrl);
      }
      
      //navigate(`/pay?id=${customer.customer_id}&name=${customer.customer_firstname} ${customer.customer_lastname} | ${customer.customer_id}`);
      setShowResults(false)
    }
  
    //handle show customer all details
    const handleShowCustomerDetails = (customer) => {
      setCustomerData(customer);
      setShowCustomerDetails(true)
    }
  
  
    const firstName = localStorage.getItem('first_name');
    const lastName = localStorage.getItem('last_name');
  
  
  
    
  
    const isSuperUser = localStorage.getItem('is_superuser')==='true'; //is admin user
    const isStaff = localStorage.getItem('is_staff')==='true';//is supervisor user
    const isActive = localStorage.getItem('is_active')==='true';//is normal worker user
    console.log('isSuperUser: ',isSuperUser);








  //for the drawer functionality

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: '100vw', pb:4 }} role="presentation" >
      
    {/* Add a container for the close button at the top */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        padding: '1rem',
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: 'rbga(255, 255, 255, 1)',
      }}>
        <IconButton 
          onClick={toggleDrawer(false)} 
          aria-label="close drawer"
          sx={{ 
            color: '#e6212a',
            '&:hover': {
              backgroundColor: 'rgba(230, 33, 42, 0.1)'
            }
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
      </Box>


      
      <Box className='flex flex-col gap-4 pl-4 overflow-auto h-[90vh]'>


      {/* image */}
      <Box sx={{ display: 'flex', flexDirection: 'column' ,gap: '1rem', alignItems: 'center', justifySelf: 'flex-start', marginTop:'5rem', paddingBottom:'3rem' }}>
        <img src={img} alt="logo" className=" w-60" />
        {/* <Typography level="h2" fontSize={30}>Groupe Diar Dzair</Typography> */}
      </Box>



          {/* navigation to the dashboard */}
          <NavLink to="/">
            {({ isActive }) => (
              <Box
                sx={{
                  cursor: 'pointer',
                  width: 'auto',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  justifyContent: 'start',
                  borderRadius: '1rem',
                  padding: '0.5rem 1rem',
                  color: isActive ? '#e6212a' : 'inherit',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: '#e6212a',
                  },
                }}
              >
                <HomeOutlinedIcon fontSize="medium" />
                <Typography
                  fontSize="1.2rem"
                  sx={{
                    color: isActive ? '#e6212a' : 'inherit',
                    transition: 'color 0.2s ease-in-out',
                  }}
                >
                  Tableau de bord
                </Typography>
              </Box>
            )}
          </NavLink>


          {/* make it expanding list for the payment */}


          { (isActive || isStaff) && !isSuperUser && (
            <>
            
              <List component={'nav'} sx={{padding:0,}}  >
                <Box className='p-0'>
                  <ListItemButton 
                    onClick={hanldeExpandList}
                    sx={{
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: 'transparent', // No background on hover
                        },
                        '&.Mui-selected, &.Mui-selected:hover': {
                          backgroundColor: 'transparent', // No background when selected
                        },
                        boxShadow: 'none', // Optional: remove any shadow
                      }}
                  >
                    <PaymentsOutlinedIcon fontSize='medium' className='mr-4 hover:bg-[none]'/>
                    <ListItemText primary='Payment' primaryTypographyProps={{ fontSize: '1.2rem' }}/>
                    {expandPayList ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </Box>

                <Collapse in={expandPayList} timeout={'auto'} className='ml-8' unmountOnExit>


                {/* naviagation to the pay */}
                {/* make it only for the staff and the active user and not allow the admin to enter it */}
                {(isActive || isStaff) && !isSuperUser && (

                  <NavLink to="/pay">
                    {({ isActive }) => (

                      <Box sx={{
                        cursor: 'pointer',
                        width: 'auto',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        justifyContent: 'start',
                        borderRadius: '1rem',
                        padding: '0.5rem 1rem',
                        color: isActive ? '#e6212a' : 'inherit',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: '#e6212a',
                        },
                      }}>
                        <CreditCardOutlinedIcon fontSize="medium" />
                        <Typography fontSize={'1.2rem'} sx={{
                            color: isActive ? '#e6212a' : 'inherit',
                            transition: 'color 0.2s ease-in-out',
                        }}>Payer</Typography>
                      </Box>

                    )}
                    
                    </NavLink>
                )}




                  {/* navigate to print the payment check */}
                  {/* make is accessible only for the staff or the active user and block the superuser */}
                  {/* { (isActive || isStaff) && !isSuperUser && (

                    <NavLink to='/print-check'>
                      {({ isActive }) => (

                        <Box sx={{
                          cursor: 'pointer',
                          width: 'auto',
                          display: 'flex',
                          gap: '1rem',
                          alignItems: 'center',
                          justifyContent: 'start',
                          borderRadius: '1rem',
                          padding: '0.5rem 1rem',
                          color: isActive ? '#e6212a' : 'inherit',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            color: '#e6212a',
                          },
                        }}>
                          <LocalPrintshopOutlinedIcon fontSize="medium" />
                          <Typography fontSize={'1.2rem'} sx={{
                              color: isActive ? '#e6212a' : 'inherit',
                              transition: 'color 0.2s ease-in-out',
                          }}>Imprimer le reçu de paiement</Typography>
                        </Box>

                      )}
                    </NavLink>
                  )} 
                   */}
                </Collapse>


              </List>
            </>
          )}









          {/* make it expanding list for the customers */}
          {/* naviagation to the create profile */}
          {/* only the person who work in cass will can access to this path */}

          {(isActive || isStaff || isSuperUser) && (
            <>
            
              <List component={'nav'} sx={{padding:0,}}  >
                <Box className='p-0'>
                  <ListItemButton 
                    onClick={handleExpandClientList}
                    sx={{
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: 'transparent', // No background on hover
                        },
                        '&.Mui-selected, &.Mui-selected:hover': {
                          backgroundColor: 'transparent', // No background when selected
                        },
                        boxShadow: 'none', // Optional: remove any shadow
                      }}
                  >
                    <GroupOutlinedIcon fontSize='medium' className='mr-4 hover:bg-[none]'/>
                    <ListItemText primary='Clients' primaryTypographyProps={{ fontSize: '1.2rem' }}/>
                    {expandClientList ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </Box>

                <Collapse in={expandClientList} timeout={'auto'} className='ml-8' unmountOnExit>
                {/* 
                  { (isActive || isStaff) && !isSuperUser && (
                  <NavLink to={"/new-customer"}>
                    {({ isActive }) => (
                      <Box sx={{     
                        cursor: 'pointer',
                        width: 'auto',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        justifyContent: 'start',
                        borderRadius: '1rem',
                        padding: '0.5rem 1rem',
                        color: isActive ? '#e6212a' : 'inherit',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: '#e6212a',
                        },}}>
                        <PersonAddAltOutlinedIcon fontSize="medium" />
                        <Typography fontSize={'1.2rem'} sx={{
                          color: isActive ? '#e6212a' : 'inherit',
                          transition: 'color 0.2s ease-in-out',
                        }}>Ajouter client</Typography>
                      </Box>

                    )}

                  </NavLink>
                )} */}

                  {/* naviagation to the statics */}

                  <NavLink to={'/static'}>
                    {({ isActive }) => (
                    <Box sx={{     
                      cursor: 'pointer',
                      width: 'auto',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center',
                      justifyContent: 'start',
                      borderRadius: '1rem',
                      padding: '0.5rem 1rem',
                      color: isActive ? '#e6212a' : 'inherit',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        color: '#e6212a',
                      },}}>
                      <ContactsOutlinedIcon fontSize="medium" />
                      <Typography fontSize={'1.2rem'} sx={{
                          color: isActive ? '#e6212a' : 'inherit',
                          transition: 'color 0.2s ease-in-out',
                        }}>List des clients</Typography>
                    </Box>

                    )}
                    
                  </NavLink>




                {/* navigate to the list of users who payed all the apport */}

                  <NavLink to='/complet'>
                    {({ isActive }) => (

                      <Box sx={{
                        cursor: 'pointer',
                        width: 'auto',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        justifyContent: 'start',
                        borderRadius: '1rem',
                        padding: '0.5rem 1rem',
                        color: isActive ? '#e6212a' : 'inherit',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: '#e6212a',
                        },
                      }}>
                        <TaskAltIcon fontSize="medium" />
                        <Typography fontSize={'1.2rem'} sx={{
                            color: isActive ? '#e6212a' : 'inherit',
                            transition: 'color 0.2s ease-in-out',
                        }}>Paiement complet</Typography>
                      </Box>

                    )}
                  </NavLink>


                  {/* navigate to the list of users who still not payed all the apport */}

                  <NavLink to='/incomplet'>
                    {({ isActive }) => (

                      <Box sx={{
                        cursor: 'pointer',
                        width: 'auto',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        justifyContent: 'start',
                        borderRadius: '1rem',
                        padding: '0.5rem 1rem',
                        color: isActive ? '#e6212a' : 'inherit',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: '#e6212a',
                        },
                      }}>
                        <UnpublishedOutlinedIcon fontSize="medium" />
                        <Typography fontSize={'1.2rem'} sx={{
                            color: isActive ? '#e6212a' : 'inherit',
                            transition: 'color 0.2s ease-in-out',
                        }}>Paiement incomplet</Typography>
                      </Box>

                    )}
                  </NavLink>
                  
                  
                  {/*see how the user collected money form each client */}
                  {(isActive && isStaff && !isSuperUser) && (

                  <NavLink to={'/Clients-encaisses'}>
                    {({ isActive }) => (
                    <Box sx={{     
                      cursor: 'pointer',
                      width: 'auto',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center',
                      justifyContent: 'start',
                      borderRadius: '1rem',
                      padding: '0.5rem 1rem',
                      color: isActive ? '#e6212a' : 'inherit',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        color: '#e6212a',
                      },}}>
                      <DeviceHubOutlinedIcon fontSize="medium" />
                      <Typography fontSize={'1.2rem'} sx={{
                          color: isActive ? '#e6212a' : 'inherit',
                          transition: 'color 0.2s ease-in-out',
                        }}>Clients encaissés</Typography>
                    </Box>

                    )}
                  </NavLink>
                  )}
                  
                  
                  {/*see how the user collected money form each client for all users only for admin */}

                  {isActive && isStaff && isSuperUser && (

                    <NavLink to={'/Clients-encaisses-all'}>
                      {({ isActive }) => (
                      <Box sx={{     
                        cursor: 'pointer',
                        width: 'auto',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        justifyContent: 'start',
                        borderRadius: '1rem',
                        padding: '0.5rem 1rem',
                        color: isActive ? '#e6212a' : 'inherit',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: '#e6212a',
                        },}}>
                        <DeviceHubOutlinedIcon fontSize="medium" />
                        <Typography fontSize={'1.2rem'} sx={{
                            color: isActive ? '#e6212a' : 'inherit',
                            transition: 'color 0.2s ease-in-out',
                          }}>Clients encaissés tout</Typography>
                      </Box>

                      )}
                    </NavLink>
                  )}













                  {/* naviagation to customers-waiting-validation */}
                  {/* only for the superuser */}
                  { (isActive && isStaff && isSuperUser) && (
                    <NavLink to={'/customers-waiting-validation'}>
                      {({ isActive }) => (
                      <Box sx={{     
                        cursor: 'pointer',
                        width: 'auto',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        justifyContent: 'start',
                        borderRadius: '1rem',
                        padding: '0.5rem 1rem',
                        color: isActive ? '#e6212a' : 'inherit',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: '#e6212a',
                        },}}>
                        <HourglassBottomOutlinedIcon fontSize="medium" />
                        <Typography fontSize={'1.2rem'} sx={{
                            color: isActive ? '#e6212a' : 'inherit',
                            transition: 'cosrc/components/UI/SideNavbar.jsxlor 0.2s ease-in-out',
                          }}>Clients en attente de validation</Typography>
                      </Box>

                      )}
                    </NavLink>
                  )}



                  {/* naviagation to customers-approved */}
                  {/* only for the superuser */}
                  { (isActive && isStaff && isSuperUser) && (
                    <NavLink to={'/customers-approved'}>
                      {({ isActive }) => (
                      <Box sx={{     
                        cursor: 'pointer',
                        width: 'auto',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        justifyContent: 'start',
                        borderRadius: '1rem',
                        padding: '0.5rem 1rem',
                        color: isActive ? '#e6212a' : 'inherit',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: '#e6212a',
                        },}}>
                        <TaskAltOutlinedIcon fontSize="medium" />
                        <Typography fontSize={'1.2rem'} sx={{
                            color: isActive ? '#e6212a' : 'inherit',
                            transition: 'color 0.2s ease-in-out',
                          }}>Clients validés</Typography>
                      </Box>

                      )}
                    </NavLink>
                  )}

                
                </Collapse>


              </List>
            </>
          )}

















          





          {/* make it expanding list for the sending money */}

          <List component={'nav'} sx={{padding:0,}}  >
            <Box className='p-0'>
              <ListItemButton 
                onClick={hanldelExpandSendMoneyList}
                sx={{
                    backgroundColor: 'transparent',
                    '&:hover': {
                      backgroundColor: 'transparent', // No background on hover
                    },
                    '&.Mui-selected, &.Mui-selected:hover': {
                      backgroundColor: 'transparent', // No background when selected
                    },
                    boxShadow: 'none', // Optional: remove any shadow
                  }}
              >
                <RepeatOutlinedIcon fontSize='medium' className='mr-4 hover:bg-[none]'/>
                <ListItemText primary='Transaction' primaryTypographyProps={{ fontSize: '1.2rem' }}/>
                {expandSendMoneyList ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </Box>

            <Collapse in={expandSendMoneyList} timeout={'auto'} className='ml-8' unmountOnExit>



            {(isActive || isStaff) && !isSuperUser &&(
              <>
              
              {/* send money page */}
              <NavLink to={'/send-money'}>
                {({ isActive }) => (
                  <Box sx={{     
                    cursor: 'pointer',
                    width: 'auto',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    justifyContent: 'start',
                    borderRadius: '1rem',
                    padding: '0.5rem 1rem',
                    color: isActive ? '#e6212a' : 'inherit',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      color: '#e6212a',
                    },}}>
                    <WifiProtectedSetupOutlinedIcon fontSize="medium" />
                    <Typography fontSize={'1.2rem'} sx={{
                        color: isActive ? '#e6212a' : 'inherit',
                        transition: 'color 0.2s ease-in-out',
                      }}>Transfert </Typography>
                  </Box>

                  )}
                </NavLink>

              {/* navigate to the list of requested money transaction */}

                <NavLink to='/transaction-history'>
                  {({ isActive }) => (

                    <Box sx={{
                      cursor: 'pointer',
                      width: 'auto',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center',
                      justifyContent: 'start',
                      borderRadius: '1rem',
                      padding: '0.5rem 1rem',
                      color: isActive ? '#e6212a' : 'inherit',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        color: '#e6212a',
                      },
                    }}>
                      <HistoryOutlinedIcon fontSize="medium" />
                      <Typography fontSize={'1.2rem'} sx={{
                          color: isActive ? '#e6212a' : 'inherit',
                          transition: 'color 0.2s ease-in-out',
                      }}>Mes transactions{/* Historique */}</Typography>
                    </Box>

                  )}
                </NavLink>
              </>
            )}
            

              {(isStaff ||isSuperUser) && (
                <>
                
                  {/* navigate to the list to see the request that was send and accept them or no */}

                  <NavLink to='/transaction-action'>
                    {({ isActive }) => (

                      <Box sx={{
                        cursor: 'pointer',
                        width: 'auto',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        justifyContent: 'start',
                        borderRadius: '1rem',
                        padding: '0.5rem 1rem',
                        color: isActive ? '#e6212a' : 'inherit',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: '#e6212a',
                        },
                      }}>
                        <InboxOutlinedIcon fontSize="medium" />
                        <Typography fontSize={'1.2rem'} sx={{
                            color: isActive ? '#e6212a' : 'inherit',
                            transition: 'color 0.2s ease-in-out',
                        }}>Demande de transactions</Typography>
                      </Box>

                    )}
                  </NavLink>
                </>
              )}




              {isSuperUser && (
                <>
                
                  {/* this page is specific for the superuser were he will can minus the amount form his account and declair the description (why he minus) */}

                  <NavLink to='/deduct-balance-action'>
                    {({ isActive }) => (

                      <Box sx={{
                        cursor: 'pointer',
                        width: 'auto',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        justifyContent: 'start',
                        borderRadius: '1rem',
                        padding: '0.5rem 1rem',
                        color: isActive ? '#e6212a' : 'inherit',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: '#e6212a',
                        },
                      }}>
                        <IosShareOutlinedIcon fontSize="medium" />
                        <Typography fontSize={'1.2rem'} sx={{
                            color: isActive ? '#e6212a' : 'inherit',
                            transition: 'color 0.2s ease-in-out',
                        }}>Action de déduction</Typography>
                      </Box>

                    )}
                  </NavLink>









                  {/* this page is specific for the superuser were he will can see the historique of his deduct form his account */}

                  <NavLink to='/deduct-balance-history'>
                    {({ isActive }) => (

                      <Box sx={{
                        cursor: 'pointer',
                        width: 'auto',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        justifyContent: 'start',
                        borderRadius: '1rem',
                        padding: '0.5rem 1rem',
                        color: isActive ? '#e6212a' : 'inherit',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: '#e6212a',
                        },
                      }}>
                        <HistoryOutlinedIcon fontSize="medium" />
                        <Typography fontSize={'1.2rem'} sx={{
                            color: isActive ? '#e6212a' : 'inherit',
                            transition: 'color 0.2s ease-in-out',
                        }}>Historique de déduction</Typography>
                      </Box>

                    )}
                  </NavLink>
                </>
              )}








              {isSuperUser && (
                <>


                  {/* this page is specific only for the superuser were they can see the transaction that happend in all the app and they can search by name(sender & reciever) and date of the transatoin (action & create) */}

                  <NavLink to='/employee-transactions'>
                    {({ isActive }) => (

                      <Box sx={{
                        cursor: 'pointer',
                        width: 'auto',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        justifyContent: 'start',
                        borderRadius: '1rem',
                        padding: '0.5rem 1rem',
                        color: isActive ? '#e6212a' : 'inherit',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: '#e6212a',
                        },
                      }}>
                        <HistoryOutlinedIcon fontSize="medium" />
                        <Typography fontSize={'1.2rem'} sx={{
                            color: isActive ? '#e6212a' : 'inherit',
                            transition: 'color 0.2s ease-in-out',
                        }}>Transactions des employés</Typography>
                      </Box>

                    )}
                  </NavLink>
                </>
              )}


              
            </Collapse>


          </List>












         

              









          {isSuperUser && (
            <>
            
              {/* make it expanding list for managing cleint taxes */}

              <List component={'nav'} sx={{padding:0,}}  >
                <Box className='p-0'>
                  <ListItemButton 
                    onClick={hanldelWorkerManaging}
                    sx={{
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: 'transparent', // No background on hover
                        },
                        '&.Mui-selected, &.Mui-selected:hover': {
                          backgroundColor: 'transparent', // No background when selected
                        },
                        boxShadow: 'none', // Optional: remove any shadow
                      }}
                  >
                    <PeopleOutlinedIcon fontSize='medium' className='mr-4 hover:bg-[none]'/>
                    <ListItemText primary='Gestion des employés' primaryTypographyProps={{ fontSize: '1.2rem' }}/>
                    {expandWorkerManaging ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </Box>

                <Collapse in={expandWorkerManaging} timeout={'auto'} className='ml-8' unmountOnExit>



                {/* regester worker page */}
                <NavLink to={'/workers-create'}>
                  {({ isActive }) => (
                    <Box sx={{     
                      cursor: 'pointer',
                      width: 'auto',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center',
                      justifyContent: 'start',
                      borderRadius: '1rem',
                      padding: '0.5rem 1rem',
                      color: isActive ? '#e6212a' : 'inherit',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        color: '#e6212a',
                      },}}>
                      <GroupAddOutlinedIcon fontSize="medium" />
                      <Typography fontSize={'1.2rem'} sx={{
                          color: isActive ? '#e6212a' : 'inherit',
                          transition: 'color 0.2s ease-in-out',
                        }}>Ajouter un employé </Typography>
                    </Box>

                    )}
                  </NavLink>
                  




                  {/* list of worker page */}
                  <NavLink to={'/workers-list'}>
                    {({ isActive }) => (
                      <Box sx={{     
                        cursor: 'pointer',
                        width: 'auto',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        justifyContent: 'start',
                        borderRadius: '1rem',
                        padding: '0.5rem 1rem',
                        color: isActive ? '#e6212a' : 'inherit',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: '#e6212a',
                        },}}>
                        <PeopleOutlinedIcon fontSize='medium'/>
                        <Typography fontSize={'1.2rem'} sx={{
                            color: isActive ? '#e6212a' : 'inherit',
                            transition: 'color 0.2s ease-in-out',
                          }}>Liste des employés</Typography>
                      </Box>

                      )}
                    </NavLink>
                

                  
                </Collapse>


              </List>





            {/* page for the admin to manage the taxes */}
            <NavLink to={'/manage-taxes'}>
              {({ isActive }) => (
                <Box sx={{     
                  cursor: 'pointer',
                  width: 'auto',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  justifyContent: 'start',
                  borderRadius: '1rem',
                  padding: '0.5rem 1rem',
                  color: isActive ? '#e6212a' : 'inherit',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: '#e6212a',
                  },}}>
                  <AppRegistrationOutlinedIcon fontSize='medium'/>
                  <Typography fontSize={'1.2rem'} sx={{
                      color: isActive ? '#e6212a' : 'inherit',
                      transition: 'color 0.2s ease-in-out',
                    }}>Gestion des Taxes</Typography>
                </Box>

                )}
              </NavLink>




            {/* page for the admin to manage the services */}
            <NavLink to={'/manage-services'}>
              {({ isActive }) => (
                <Box sx={{     
                  cursor: 'pointer',
                  width: 'auto',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  justifyContent: 'start',
                  borderRadius: '1rem',
                  padding: '0.5rem 1rem',
                  color: isActive ? '#e6212a' : 'inherit',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: '#e6212a',
                  },}}>
                  <AppRegistrationOutlinedIcon fontSize='medium'/>
                  <Typography fontSize={'1.2rem'} sx={{
                      color: isActive ? '#e6212a' : 'inherit',
                      transition: 'color 0.2s ease-in-out',
                    }}>Gestion des services</Typography>
                </Box>

                )}
              </NavLink>






              {/* page for the admin to manage the recu of paiement */}
              <NavLink to={'/manage-recu-paiement'}>
                {({ isActive }) => (
                  <Box sx={{     
                    cursor: 'pointer',
                    width: 'auto',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    justifyContent: 'start',
                    borderRadius: '1rem',
                    padding: '0.5rem 1rem',
                    color: isActive ? '#e6212a' : 'inherit',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      color: '#e6212a',
                    },}}>
                    <AppRegistrationOutlinedIcon fontSize='medium'/>
                    <Typography fontSize={'1.2rem'} sx={{
                        color: isActive ? '#e6212a' : 'inherit',
                        transition: 'color 0.2s ease-in-out',
                      }}>Gestion des recu de paiement</Typography>
                  </Box>

                  )}
                </NavLink>


            </>





          )}


            
        </Box>
        <Box sx={{
              marginTop: '1.5rem',
              display: 'flex',
              justifyContent: 'center',
            }}>

              {/* logout */}
              <Button 
                variant="contained" 
                color="error" 
                size="lg" 
                sx={{
                    
                  width:'80%',
                  placeSelf: 'end',
                }} 
                onClick={()=>logout()}
                >
                  Logout
              </Button>
            </Box>
    </Box>
  );





  return (
    <>
    
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar
           sx={{
            backgroundColor: '#e6212a',
           }}
          >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {user_first_name} {user_last_name}
              <VerifiedUserOutlinedIcon fontSize='small' sx={{ml:1}}/>
            </Typography>
            <Button color="inherit" variant="outlined" onClick={()=>logout()}>Logout</Button>
          </Toolbar>
        </AppBar>
      </Box>


      {/* the drawer */}
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>











      <ModalCard
          title={'Résultats de recherche'} 
          showModal={showResults}
          setShowModal={setShowResults}
          icon={<SearchOutlinedIcon fontSize="large" />}
          color={'neutral'}
        >
      {searchResults && searchResults.length > 0 ? (
      <Box sx={{  marginTop: '0.5rem', maxHeight: '70vh', overflow: 'auto' }}>
        {searchResults.map((customer) => (
          <Box 
            key={customer.customer_id}
            sx={{
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              marginBottom: '1rem',
              backgroundColor: '#f9f9f9',
              transition: 'all 0.2s',
              cursor: 'default',

              '&:hover': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                backgroundColor: '#f0f0f0',
              }
            }}
            onClick={() => {
              // You can add navigation to the customer profile here
              // For example: navigate(`/customer/${customer.customer_id}`);
              //setShowResults(false);
            }}
          >
            {/* Customer basic info */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <Typography level="h4" fontWeight="bold">
                {customer.customer_firstname} {customer.customer_lastname}
              </Typography>
              <Typography 
                level="body1" 
                sx={{ 
                  backgroundColor: '#e6212a', 
                  color: 'white', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                ID: {customer.customer_id}
              </Typography>
            </Box>
            
            {/* Contact info */}
            <Box sx={{ marginBottom: '0.5rem', color: '#666' }}>
              <Typography level="body2"><LocalPhoneRoundedIcon/>{customer.customer_mobile} </Typography>
              <Typography><AlternateEmailRoundedIcon/> {customer.customer_email}</Typography>
              <Typography level="body2">
                <FmdGoodRoundedIcon/>{customer.customer_address}, {customer.customer_daira}, {customer.customer_wilaya}
              </Typography>
            </Box>
            
            {/* Financial info */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '1rem',
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '0.5rem'
            }}>
              {/* Apport Personnel */}
              <Box>
                <Typography level="body2" fontWeight="bold">Apport Personnel: {Number(customer.customer_apport_personnel)} DA</Typography>
                {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography level="body2">Initial: </Typography>
                  <Typography level="body2" fontWeight="bold"></Typography>
                </Box> */}
                <Typography level="body2" fontWeight="bold">Service: {Number(customer.customer_frais_service)} DA ({customer.customer_service_name})</Typography>
                { customer.customertaxtracking_set.map((tax) => {
                  return (
                    <>
                     <Typography level="body2" fontWeight="bold">{tax.tax_name}: {Number(tax.amount)} DA</Typography>
                    </>
                  )
                })	}
              </Box>
              

            </Box>
            
            {/* Products summary */}
            {customer.products && customer.products.length > 0 && (
              <Box sx={{ marginTop: '0.5rem' }}>
                <Typography level="body2" fontWeight="bold" sx={{ color: '#666' }}>
                  {customer.products.length} produit(s)
                </Typography>
              </Box>
            )}

            {/* button to see more details or pay */}

            <Box className='flex justify-end gap-4'>
            {localStorage.getItem('is_superuser')==='false' && (<>
              <Box>
                <Button
                  variant="contained"
                  onClick={()=>handlePaymentAction(customer)}
                >
                  <PointOfSaleRoundedIcon className='mr-2'/>
                  Payer
                </Button>
              </Box>
            
            </>)}

              <Box>
                <Button
                  variant="contained"
                  onClick={() => handleShowCustomerDetails(customer)}
                >
                  <InfoRoundedIcon 
                    className='mr-2'/>
                  Voir plus details</Button>
              </Box>
            </Box>
          </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ padding: '2rem', textAlign: 'center' }}>
          <Typography level="body1">Aucun résultat trouvé</Typography>
        </Box>
      )}

        <>
          {/* Add close button */}
          <Button 
            onClick={() => setShowResults(false)}
            variant="contained"
            color={"error"}
            sx={{ alignSelf: 'center', fontSize:'1.2rem', padding:'0.5rem 1.7rem'}}
          >
            Fermer
          </Button>
        </>


        </ModalCard>





      {/* show customer data */}
      {showCustomerDetails && (
        
        <CustomerDetails
          showModal={showCustomerDetails}
          setShowModal={setShowCustomerDetails}
          data={customerData}
        />
      )}
    </>
  );
}
