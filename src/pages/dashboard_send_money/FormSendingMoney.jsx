
import { useEffect, useState } from "react";
import { useForm, Controller, set } from "react-hook-form";

//function to get the account money collected
import useAccountMoneyCollected from "../../services/getAccountMoneyCollected";

//function to send the money requset
import sendMoneyRequest from "../../services/sendMoneyRequest";

import ModalCard from "../../components/UI/ModalCard";

import { Box, Typography, TextField, Button } from '@mui/material';
import ComboTextInputSendMoney from '../../components/UI/ComboTextInputSendMoney'
import WifiProtectedSetupOutlinedIcon from '@mui/icons-material/WifiProtectedSetupOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ComboTextInputSelectClientForTransaction from '../../components/UI/ComboTextInputSelectClientForTransaction'


import useIsMobile from "../../hooks/useIsMobile";


export default function FormSendingMoney({ userBalance }) {
  

  // Add a new state variable at the top of your component
  const [resetKey, setResetKey] = useState(0);

  const [isLoading, setIsLoading] = useState(false);


  const isMobile = useIsMobile();

  const currentUserId = Number(localStorage.getItem('user_id'));
  // Suppose you fetch users from somewhere:
  const [users, setUsers] = useState([]);


  // State to hold the selected user for sending money
  const [userSelected, setUserSelected] = useState();

  // state to hold the selected client for the transaction
  const [clientSelected, setClientSelected] = useState();



  //for modal 
  const [showModal,setShowModal]=useState(false);
  const [modalIcon,setModalIcon]=useState();
  const [modalColor, setModalColor] = useState();
  const [modalTitle, setModalTitle] = useState();

  //for showing the modal children
  const [showModalChildren, setShowModalChildren] = useState(false);


  //for the user sender
    
  useEffect(()=> {
    console.log('User data for sending money:', userBalance || "no User Balance");
  },[userBalance])

  const { control, handleSubmit, formState: { errors } , getValues, setValue, reset, setError} = useForm({
    defaultValues: {
      user_id_sender: '',
      user_id_reciever: '',
      montant: '',
      client_id: ''
    }
  });
  


  const onSubmit = async (data) => { 

    // check if the user has send money no more than the totla amount of the money he collect form the client
    if (Number(data.montant) > Number(clientSelected.collected_amount)) {
      // Show the error message in the form
      setError("montant", {
        type: "manual",
        message: "Le montant à envoyer ne peut pas dépasser le montant collecté du client."
      });
      return; // Prevent form submission
    }


    // check if the user has send enough money not more the balance he has
    if (Number(data.montant) > Number(userBalance)) {
      // show the error message in the form
      setError("montant", {
        type: "manual",
        message: "Le montant à envoyer ne peut pas dépasser le solde de l'expéditeur."
      });
      return; // Prevent form submission
    }


    setValue('user_id_sender', localStorage.getItem('user_id')); // Assuming you have the sender's user ID stored in localStorage
    console.log('Form data submitted for sending money:', data);

    //show modal
    setShowModalChildren(true);
    setModalIcon(<InfoOutlinedIcon fontSize="large"/>)
    setShowModal(true);
    setModalColor('white');
    setModalTitle('Confirmation');
  

    // Reset the form after submission
    //reset(); 
    //setUserSelected(null); // Reset the selected user
  }


  //function to handle sanding money request
  const handleCorfirmSendMoney = () => {
    setIsLoading(true);

    sendMoneyRequest({
      transaction_amount: getValues("montant"),
      transaction_sender: getValues("user_id_sender"),
      transaction_receiver: getValues("user_id_reciever"),

      //add the client 
      transaction_related_customer: getValues('client_id')

    })
      .then(response => {
        
        console.log('Money sent successfully:', response);
        
        //hide the modal
        setShowModalChildren(false)
        // Show success modal
        setModalIcon(<CheckCircleOutlinedIcon fontSize='large'/>)
        setModalColor('success');
        setModalTitle('La demande a été envoyée avec succès');
        setShowModal(true);
        
        // Reset the form after successful submission
        reset();
        setUserSelected(null); // Reset the selected user
        setClientSelected(null); // Reset the selected client
        setResetKey(prevKey => prevKey + 1); // Add this to force re-render
      })
      .catch(error => {
        console.error('Error sending money:', error);
        
        // Hide the modal children
        setShowModalChildren(false);
        // Show error modal
        setModalIcon(<InfoOutlinedIcon fontSize="large"/>);
        setModalColor('danger');
        setModalTitle('Une erreur est survenue : la demande n’a pas pu être envoyée');
        setShowModal(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return(
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: isMobile ? 1 :2, 
          padding: 2, 
          alignItems:'start',  
          placeSelf:'center', 
          //width: '35%',
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          paddingTop: 4,
          paddingBottom: 6,
          paddingX: 4,
          marginTop: 4,
          width: isMobile ? '95%' : 'fit-content',
        }}
      >
       
       
       {/* The header */}
        <Box sx={{ 
            display: 'flex', 
            placeSelf: 'start', 
            gap: 2,
            mb: 2
          }}>
            <WifiProtectedSetupOutlinedIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />
            <Typography 
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem' }, 
                fontWeight: 'bold', 
                color: 'text.primary' 
              }}
            >
              Transférer de l’argent
            </Typography>
          </Box>


          {/* Fields */}

          {/* new input of customer id input */}
          <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
            Destinataire
          </Typography>
          
          
          {/* user ID */}
          <Controller
            name="user_id_reciever"
            control={control}
            rules={{ 
              required: "L'ID utilisateur est requis",
              

              validate: value => {
              const senderId = Number(localStorage.getItem('user_id'));
              if (!value || parseInt(value) <= 0) {
                return "L'ID utilisateur doit être positif";
              }
              if (parseInt(value) === senderId) {
                return "Vous ne pouvez pas vous envoyer de l'argent à vous-même";
              }
              return true;
            }
              
              
            }}
            render={({ field, fieldState }) => (
              <Box className="w-full">
                <ComboTextInputSendMoney 
                  key={`user-select-${resetKey}`} // Add key to force re-render

                  customerName={userSelected || ''} // Changed from name={customerName}
                  onCustomerSelect={(customer) => {
                    console.log('cicked the oncustomerselect');
                    
                    setValue('user_id', customer.id);
                    // Update the form field value
                    field.onChange(customer.id);
                    console.log("Selected user ID for sending money:", customer.id);

                    //update the state of userSelected
                    setUserSelected(customer);
                  }} 
                />
                {fieldState.error && (
                  <Typography sx={{ color:'#d32f2f', fontSize: '0.75rem', ml: 1.5, mt: 0.5 }}>
                    {fieldState.error.message}
                  </Typography>
                )}
              </Box>
            )}
          />


        
        
        {/* select the client to send the money that he collect form him */}
          <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
            Selectioner un client
          </Typography>
          
          
          {/* customer ID */}
          <Controller
            name="client_id"
            control={control}
            rules={{ 
              required: "L'ID de client est requis",
            }}
            render={({ field, fieldState }) => (
              <Box className="w-full">
                <ComboTextInputSelectClientForTransaction

                  key={`client-select-${resetKey}`} // Add key to force re-render
                  customerName={clientSelected || ''} // Changed from name={customerName}
                  onCustomerSelect={(customer) => {
                    console.log('cicked the oncustomerselect');
                    
                    setValue('client_id', customer.customer);
                    // Update the form field value
                    field.onChange(customer.customer);
                    console.log("Selected user ID for sending money:", customer.customer);

                    //update the state of userSelected
                    setClientSelected(customer);
                  }} 
                />
                {fieldState.error && (
                  <Typography sx={{ color:'#d32f2f', fontSize: '0.75rem', ml: 1.5, mt: 0.5 }}>
                    {fieldState.error.message}
                  </Typography>
                )}
              </Box>
            )}
          />

          <Typography>
            {clientSelected && `Vous avez reçu ${Number(clientSelected.collected_amount)} DA de ce client.`}
          </Typography>





        {/* typed the amount to send*/}

        <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
          Montant
        </Typography>
        
        <Controller
          name="montant"
          control={control}
          rules={{ 
            required: "Le montant est requis",
            min: { value: 0.001, message: "Le montant doit être supérieur a 0" },
            validate: {
              maxThreeDecimals: (value) =>
                /^-?\d+(\.\d{1,3})?$/.test(value) || "Maximum 3 chiffres après la virgule"
            }
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              type="number"
              inputProps={{ step: 'any', min: 0 }}
              label="Achat payé (DA)"
              placeholder="Entrez le montant"
              variant="outlined"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

          <Button
          type="submit"
          variant="contained"
          color="error"
          sx={{
            width: '100%',
            marginTop: 6,
            textTransform: 'none',
          }}
          >
            	Envoyer
          </Button>
      </Box>

      <ModalCard
        showModal={showModal} 
        color={modalColor}
        title={modalTitle} 
        setShowModal={setShowModal}
        icon={modalIcon}
      >
        {showModalChildren &&
        (
          <>
            {/* Transaction Details */}
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              
              <Box >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Détails de la transaction
                </Typography>                
              </Box>
              
              <Box>
                <Typography sx={{display: 'flex', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row'}}>
                  <strong>Expéditeur :</strong>{" "}
                  {localStorage.getItem('first_name')} {localStorage.getItem('last_name')}
                </Typography>
              </Box>


              <Box>
                <Typography sx={{display: 'flex', justifyContent: 'space-between',  flexDirection: isMobile ? 'column' : 'row'}}>
                  <strong>Destinataire :</strong>{" "}
                  {userSelected?.first_name} {userSelected?.last_name}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{display: 'flex', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row'}}>
                  <strong>Montant à transférer :</strong>{" "}
                  {getValues("montant") || 0} DA
                </Typography>
              </Box>
              
              <Box>
                <Typography sx={{display: 'flex', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row'}}>
                  <strong>Montant restant (global) :</strong>{" "}
                  {userBalance !== undefined && getValues("montant")
                    ? (Number(userBalance) - Number(getValues("montant")))
                    : ""}
                  {" "}DA
                </Typography>
              </Box>


              <Box>
                <Typography sx={{display: 'flex', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row'}}>
                  <strong>Montant restant (client) :</strong>{" "}
                  {userBalance !== undefined && getValues("montant")
                    ? (Number(clientSelected.collected_amount) - Number(getValues("montant")))
                    : ""}
                  {" "}DA
                </Typography>
              </Box>
              

              <Box>
                {(Number(userBalance) - Number(getValues("montant"))) < 0 &&
                <Typography sx={{ color: 'error.main', fontWeight: 'bold' }}>
                  Attention : Le solde de l'expéditeur est insuffisant pour ce transfert.
                </Typography>
                }
              </Box>
                
                <Button
                  variant="contained"
                  onClick={() => {
                    console.log('clicked and confirmed');


                    //hanlde sending the request to the reciever
                    handleCorfirmSendMoney();
                  }}
                  disabled={
                  ((Number(userBalance) - Number(getValues("montant"))) < 0) || isLoading
                  }
                  loading={isLoading}
                  sx={{
                    marginTop: '2rem',
                    textTransform: 'none',
                    bgcolor:'#f44336',
                    '&:hover': {
                      bgcolor: '#e53935',
                    },
                  }}

                  >
                  Confirmer
                </Button>

            </Box>
          </>
        )  
        }

      </ModalCard>
    </>
  )
}