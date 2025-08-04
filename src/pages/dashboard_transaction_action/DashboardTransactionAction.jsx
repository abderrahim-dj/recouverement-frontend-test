import { use, useEffect, useState } from "react";

//import the table to show the transaction actions history of the user
import TableTeransactionAction from "./TableTransactionActon";


//function to handle accepting or rejecting the transaction
import acceptTransactionAction from "../../services/acceptTransactionAction";

//function to get the balnce of the user
import useAccountMoneyCollected from "../../services/getAccountMoneyCollected";


//import the modal for success or error
import ModalCard from "../../components/UI/ModalCard";


import SideNavbar from "../../components/UI/SideNavbar";
import UserLogged from "../../components/UI/UserLogged";
import useAuth from "../../hooks/useAuth";
import { Typography, Box, Fade, Grow, CircularProgress } from "@mui/material";
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

// the boxes of action to make it accept it or reject the transaction
import { CardTransactionAction } from "../../components/UI/CardTransactionAction";


//import the function that will get the list of transactions that are waiting fo this user
import getListOfWaitingTransaction from "../../services/getLisOfWaitingTransaction";


import CancelPresentationOutlinedIcon from '@mui/icons-material/CancelPresentationOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';

import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';


import ScrollableList from "../../components/UI/ScrollableList";
import { Refresh } from "@mui/icons-material";


import useIsMobile from "../../hooks/useIsMobile";

export default function DashboardTransactionAction() {
  

  const isMobile = useIsMobile();

  //this is for the accepting or rejecting the transaction buttons
  const [isActionLoading, setIsActionLoading] = useState(false);

  //chekc authentication
  useAuth();


  //state to refresh the history after accepting or rejecting a transaction
  const [refreshActoinHistory, setRefreshActionHistory] = useState(0);


  
  //state to store the list of the transactions that are waiting for the action
  const [waitingTransactionActoins, setWatingTransactionActoins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userBalance, setUserBalance] = useState();
  

  //state for the modal
  const [showModal, setShowModal] = useState(false);
  const [modalColor, setModalColor] = useState();
  const [modalTitle, setModalTitle] = useState();
  const [modalIcon, setModalIcon] = useState();
  const [modalMessage, setModalMessage] = useState();
  
  // function to get the list of transactions that are waiting for the user so he can accept thenm or reject
  const {UsersData, isLoading: isLoaindUserAmount} = useAccountMoneyCollected(localStorage.getItem('user_id'));

  useEffect(() => {
    if(UsersData){
      setUserBalance(UsersData.balance);
    }
  }, [UsersData]);





  //useEffect to get the balance of the user
  useEffect(() => {
    const fetchWaitingTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getListOfWaitingTransaction();
        setWatingTransactionActoins(data);
      } catch (error) {
        console.error('Error fetching waiting transactions:', error);
        setError(error);
      } finally {
        setTimeout(() => {
          
          setIsLoading(false);
        }, 500);
      }
    }
    fetchWaitingTransactions();
  },[])


  //functions to handle accepting the transaction and show the modal of success
  
  //function to handle accepting the transaction
  const handleAcceptTransaction = async(transactionId, senderId, receiverId, customerId) => {
    try {
      setIsActionLoading(true);
      const response = await acceptTransactionAction(transactionId, senderId, receiverId, 'Accepter', customerId);
      console.log('Transaction accepted:', response);

      
      //show the modal the reject success message
      setShowModal(true);
      setModalColor('success');
      setModalTitle('Transaction acceptée avec succès');
      setModalIcon(<CheckBoxOutlinedIcon fontSize="large"/>);
      
      // Update the user balance state with the new balance from the response
      setUserBalance(Number(response.receiver_new_banance))

      // Optionally, you can update the state to remove the accepted transaction from the list
      setWatingTransactionActoins(prev => prev.filter(t => t.id !== transactionId));
    } catch (error) {

      //show the modal error message
      setShowModal(true);
      setModalColor('danger');
      setModalTitle('Erreur lors de l\'acceptation de la transaction. Il est possible que le solde actuel de l\'utilisateur soit insuffisant.');
      setModalIcon(<ReportOutlinedIcon fontSize="large"/>);

      console.log('Error accepting transaction:', error);
    }finally {
      setIsActionLoading(false);
    }
  }


  //function to handle rejecting the transaction
  const handleRejectTransaction = async(transactionId, senderId, receiverId) => {
    try {
      setIsActionLoading(true);
      const response = await acceptTransactionAction(transactionId, senderId, receiverId, 'Rejeter');
      console.log('Transaction rejected:', response);
      
      //show the modal the reject success message
      setShowModal(true);
      setModalColor('success');
      setModalTitle('Transaction refusée avec succès');
      setModalIcon(<CancelPresentationOutlinedIcon fontSize="large"/>);


      
      
      // Optionally, you can update the state to remove the rejected transaction from the list
      setWatingTransactionActoins(prev => prev.filter(t => t.id !== transactionId));



    } catch (error) {

      //show the modal error message

      //show the modal error message
      setShowModal(true);
      setModalColor('danger');
      setModalTitle('Erreur lors du refus de la transaction');
      setModalIcon(<ReportOutlinedIcon fontSize="large"/>);

      console.log('Error rejecting transaction:', error);
    } finally {
      setIsActionLoading(false);
    }
  }






  return (
    <>
      <SideNavbar/>
      {isMobile ? (<></>) : (<UserLogged/>)}

      <main className={`${isMobile ? 'pl-0 py-[5vh]' : 'pl-[15vw] py-[10vh]'} mb-50 bg-[#fafafa]`}>
        <Typography
          sx={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: isMobile ? '3rem' : '1rem',
              color: '#333',
              textAlign: 'center',
              textTransform: 'uppercase',
            }} 
        >Gérer les transactions
          {/* <InboxOutlinedIcon fontSize="inherit"/> */}
        </Typography>

         
        <Typography sx={{
          textAlign: 'center',
          fontSize: '1.2rem',
          fontWeight: 'bold',
        }}>
          Votre solde actuel est de {isLoaindUserAmount ? (
            <CircularProgress size={'1.2rem'}/>
          ) : (
            <span className="text-green-500">{Number(userBalance)} DA</span>
          )}
        </Typography>


        {/* this will have 2 sections the section of the card to request to accept the transaction and a table to see the historyc of accepting or rejecting the trasaction */}  
        <Box sx={{
          mt:4,
          display: 'flex',
          gap:'1rem',
          paddingX: '2vw',
          flexDirection: isMobile ? 'column' : 'row',

        }}>
            {/* section of card request to accept the transaction */}
            <Box sx={{
              width: isMobile ? '100%' : '30%',
              height: 'fit-content',
              maxHeight: '90vh',
              paddingRight: isMobile ? '0rem': '0.5rem',
              backgroundColor: 'off-white',
              
            }}>
                
            
              
              {/* Display the loading indicator */}
              {isLoading &&  (
                <Box sx={{
                  display:'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>

                  <CircularProgress size={'5rem'}/>
                </Box>
              )}

              {/* Display the error message if there is an error */}
              {error && <Typography color="error">Error: {error.message}</Typography>}


            {/* showing the list of requests */}
            {!isLoading && !error && waitingTransactionActoins.length > 0 && (

              <ScrollableList>

                {/* Display the list of waiting transaction actions */}
                
                  {waitingTransactionActoins.map((transaction, index) => (
                    <Grow 
                      key={transaction.id}
                      in={true} 
                      style={{ transformOrigin: 'center top' }}
                      timeout={{ 
                        enter: 500 + (index * 150), // Stagger the animations
                        exit: 300
                      }}
                    >
                      <div> {/* Wrapper div is required */}
                        <CardTransactionAction
                          sender={transaction.transaction_sender}
                          reciever={transaction.transaction_receiver}
                          amount={transaction.transaction_amount}
                          date={transaction.transaction_date_send}
                          client={transaction.transaction_related_customer_full_name}
                          clientId={transaction.transaction_related_customer}
                          isActionLoading={isActionLoading}
                          hanldeAccept={() => {
                          handleAcceptTransaction(transaction.id, transaction.transaction_sender_id, transaction.transaction_receiver_id, transaction.transaction_related_customer);
                          // Increment the refresh history state to trigger a re-fetch
                          setRefreshActionHistory(prev => prev + 1);
                          }}
                          hanldeReject={() => {
                            handleRejectTransaction(transaction.id, transaction.transaction_sender_id, transaction.transaction_receiver_id);
                            // Increment the refresh history state to trigger a re-fetch
                            setRefreshActionHistory(prev => prev + 1);
                          }}
                        />
                      </div>
                    </Grow>
                  ))}
                


              </ScrollableList>
            )}




              {/* show message if the list of waiting transaction actions is impty */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '2rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                {!isLoading && !error && waitingTransactionActoins.length === 0 && (
                  <Fade in={true} timeout={500}>
                    <Typography sx={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.2rem', color: '#666', fontWeight: 'bold' }}>
                      Aucune transaction en attente
                      <br />
                      <InboxOutlinedIcon sx={{fontSize:'4rem'}}/>
                    </Typography>
                  </Fade>
                )}
              </Box>
            </Box>

            
            
            
            
            
            
            {/* section of the table that will show the actions historique */}
            <Box sx={{
              width: isMobile ? '100%' : '70%',
            }}>
              <Typography
               sx={{
                  fontSize: isMobile ? '1.2rem' : '1.5rem',
                  fontWeight: 'bold',
                  marginTop: isMobile ? '2rem' : '1rem',
                  color: '#333',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  marginBottom: 4
               }}

              >Historique des actions</Typography>

              <TableTeransactionAction refresh={refreshActoinHistory}/>
            </Box>
        </Box>
      
      </main>


      {/* the modal */}

      <ModalCard
        setShowModal={setShowModal}
        showModal={showModal}
        color={modalColor}
        title={modalTitle}
        icon={modalIcon}
      >

      </ModalCard>
    </>
  );
}