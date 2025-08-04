import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import ModalCard from "../../components/UI/ModalCard";

import acceptDeductAction from "../../services/acceptDeductAction";
import NotificationImportantOutlinedIcon from '@mui/icons-material/NotificationImportantOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

import { 
  Box, 
  Typography, 
  TextField, 
  TextareaAutosize,
  Button 
} from "@mui/material";




import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import { Padding } from "@mui/icons-material";


import useIsMobile from "../../hooks/useIsMobile";

export default function FormDeductAmount({ currentAmount, setUserBalance }) {
  
  const isMobile = useIsMobile();


  // state for the modal
  const [showModal,setShowModal]=useState(false);
  const [modalIcon,setModalIcon]=useState();
  const [modalColor, setModalColor] = useState();
  const [modalTitle, setModalTitle] = useState();

  const [showModalChildren, setShowModalChildren] = useState(false);

  const [isLoading, setIsLoading] = useState(false);



  const { control, handleSubmit, formState: { errors }, setValue, getValues, reset } = useForm({
    defaultValues: {
      user_id: '',
      amount: '',
      description: '',
    }
  });


  const onSubmit = async (data) => {
    setValue('user_id', localStorage.getItem('user_id'))
    
    console.log('Form submitted data: ', data);


    //open the modal
    setShowModal(true);
    setModalIcon(<IosShareOutlinedIcon fontSize="large"/>);
    setModalColor('white');
    setModalTitle('Action de déduction');

    //set to show the mdal children
    setShowModalChildren(true)
  }



  // function to handle the accept action
  const handleAccept = async() => {
    

    setIsLoading(true);
    //forming the data to send to the backend
    const data = {
      user_id: localStorage.getItem('user_id'),
      amount: getValues('amount'),
      description: getValues('description')
    }

    try {
      const response = await acceptDeductAction(data);
      console.log('Response from acceptDeductAction: ', response);


      if (response) {
        //chow the success message in the modal
        setModalIcon(<CheckCircleOutlineOutlinedIcon fontSize="large"/>)
        setModalColor('success');
        setModalTitle('Action acceptée');
        setShowModalChildren(false);
        //update the current amount 
        setUserBalance(Number(currentAmount) - Number(getValues('amount')));


      } else {
        // If response is falsy (shouldn't happen with your service, but just in case)
        setModalIcon(<NotificationImportantOutlinedIcon fontSize="large" />);
        setModalColor('danger');
        setModalTitle('Erreur');
        setShowModalChildren(false);


      }

    } 
    
    catch (error) {



      //show the error message in the modal
      console.error('Error accepting deduct action: ', error);
      setModalIcon(<NotificationImportantOutlinedIcon fontSize="large"/>);
      setModalColor('danger');
      setModalTitle('Erreur');
      setShowModalChildren(false);
      return;
    } finally{
        //reset the form
        setIsLoading(false);
        reset();
    }


  }

  
  return (

    <>
      <Box 
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: isMobile ? '95%' : 'fit-content', // or you can use a specific width like '500px'
          //maxWidth
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 1 : 2 ,
          px:isMobile ? 3 : 5,
          pt:isMobile ? 3 : 5,
          pb:isMobile ? 3 : 5,
          backgroundColor: 'white',
          borderRadius:2,
          boxShadow:4
        }}
      >

        {/* top section */}
        <Box className='flex items-center justify-center gap-4 mb-6'>
          <IosShareOutlinedIcon sx={{fontSize: isMobile ? '2rem':'2.5rem'}}/>
          <Typography variant={isMobile ? "h5" : "h4"}>Action de déduction</Typography>
        </Box>



        {/* amout deduct */}

        <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
          Montant à déduire
        </Typography>


        <Controller
          name="amount"
          control={control}
          rules={{
            required: 'Le montant est requis',
            min: {value:0.1, message: 'Le montant doit être supérieur ou égal à 0'},
            validate: {
              maxThreeDecimals: (value) =>
                /^-?\d+(\.\d{1,3})?$/.test(value) || "Maximum 3 chiffres après la virgule"
            }
          }}
          render={({ field, fieldState}) => (
            <TextField
              {...field}
              fullWidth
              type="number"
              inputProps={{ step: 'any', min:0}}
              label="Montant à déduire"
              variant="outlined"
              error={!!fieldState.error}
              helperText={fieldState.error ? fieldState.error.message : 'Entrez le montant à déduire'}
            >

            </TextField>
          )}
        >

        </Controller>



        {/* description */}
        
        
        <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
          Description de l'action
        </Typography>

        <Controller
          name="description"
          control={control}
          rules={{
            required: 'La description est requise',
            minLength: {
              value: 1,
              message: 'La description doit comporter au moins 1 caractère'
            }
          }}

          render={({ field, fieldState}) => (
            <TextField
              {...field}
              multiline
              minRows={1}
              maxRows={4}
              fullWidth
              label="Description de l'action de déduction"
              variant="outlined"
              error={!!fieldState.error}
              helperText={fieldState.error ? fieldState.error.message : "Entrez une description de l'action de déduction"}            
            >

            </TextField>
          )}

        >
        </Controller>


        {/* buttom to submit */}
        <Button 
          type="Submit"
          variant="contained"
          color="error"
          sx={{
            marginTop:4,
            textTransform: 'none',

          }}
        >
          Validée
        </Button>
      </Box>



      {/* the modal */}
      <ModalCard
        showModal={showModal}
        setShowModal={setShowModal}
        icon={modalIcon}
        color={modalColor}
        title={modalTitle}
      >
        {/* modal children */}

{ showModalChildren && (
  <Box className='flex flex-col gap-2' sx={{ width: '100%' }}>
    <Typography>
      username: {localStorage.getItem('last_name')} {localStorage.getItem('first_name')}
    </Typography>

    <Typography>
      Montant actuel: <strong>{Number(currentAmount)}</strong> DA
    </Typography>
    <Typography>
      Montant à déduire: <strong>{getValues('amount')}</strong> DA
    </Typography>

    <Typography
      sx={{
        whiteSpace: 'pre-line',
      }}
    >
      Description:
      <br/> 
      <Box
        sx={{
          marginTop: 2,
          border: '1px solid #ccc',
          paddingX: 2,
          paddingY: 1,
          borderRadius: 2,
          maxHeight: '10rem',
          overflowY: 'auto',
          wordWrap: 'break-word',
          width: '100%',
          maxWidth: isMobile ? '100%' : '25rem',
        }}
      >
        {getValues('description')}
      </Box>
    </Typography>

    {/* the new amount or the amount left*/}
    <Typography  
      sx={{
        marginTop: 2,
        wordWrap: 'break-word',
        width: '100%',
      }}>
      Le montant restant après la déduction sera de:
      <Typography sx={{textAlign: 'center', fontSize: '1.5rem', marginTop: 2}}>
        <strong> {Number(currentAmount) - Number(getValues('amount'))} DA</strong>
      </Typography>
    </Typography>

    {/* actions buttons */}
    <Box sx={{
      marginTop: 2,
      display: 'flex',
      justifyContent: isMobile ? 'center' : 'flex-end',
      flexDirection: isMobile ? 'column' : 'row',
      gap: 2
    }}>
      <Button
        variant="contained"
        color="success"
        onClick={handleAccept}
        fullWidth={isMobile}
        loading={isLoading}
        disabled={isLoading}
        sx={{
          textTransform: 'none',
        }}
      >
        Accepter
      </Button>

      <Button
        variant="contained"
        color="error"
        onClick={()=> {
          setShowModal(false);
          reset();
          setShowModalChildren(false);
        }}
        fullWidth={isMobile}
        sx={{
          textTransform: 'none',
        }}
      >
        Refuser
      </Button>
    </Box>
  </Box>
)}
        
        
      </ModalCard>

    </>
  )
}




        // { showModalChildren  && (

        //   <Box className='flex flex-col gap-2'>
        //     <Typography>
        //       username: {localStorage.getItem('last_name')} {localStorage.getItem('first_name')}
        //     </Typography>

        //     <Typography>
        //       current amount: <strong>{Number(currentAmount)}</strong> DA
        //     </Typography>
        //     <Typography>
        //       amount will deduct: <strong>{getValues('amount')}</strong> DA
        //     </Typography>

        //     <Typography
        //       sx={{
        //         whiteSpace: 'pre-line',
        //       }}
        //       // dangrouslySetInnerHTML={{
        //       //   __html: getValues('description').replace(/\n/g, '<br />')
        //       // }}
        //     >
        //       discription:
        //       <br/> 
        //       <Box
        //         sx={{
        //           marginTop: 2,
        //           //backgroundColor: '#eaeaea',
        //           border: '1px solid #ccc',
        //           paddingX: 2,
        //           paddingY: 1,
        //           borderRadius: 2,
        //           maxHeight: '10rem',
        //           overflowY: 'auto',
        //           wordWrap: 'break-word',
        //           width: '20vw',
        //         }}
        //       >
        //           {getValues('description')}
        //       </Box>

        //     </Typography>


        //     {/* the new amount or the amount left*/}

              
        //     <Typography  
        //       sx={{
        //         marginTop:2,
        //         wordWrap: 'break-word',
        //         width: '20vw',
        //         }}>
        //       Le montant restant après la déduction sera de:
        //         <Typography>
        //           <strong> {Number(currentAmount) - Number(getValues('amount'))} DA</strong>
        //         </Typography>
        //     </Typography>



        //     {/* actions buttons */}
        //     <Box sx={{
        //       marginTop:2,
        //       display: 'flex',
        //       justifyContent: 'end',
        //       gap: 2
        //     }}>

        //       <Button
        //         variant="contained"
        //         color="success"
        //         onClick={handleAccept}
        //       >
        //         Accept
        //       </Button>


        //       <Button
        //         variant="contained"
        //         color="error"
        //         onClick={()=> {
        //           setShowModal(false);
        //           reset();
        //           setShowModalChildren(false);
        //         }}
        //       >
        //         Refuse
        //       </Button>
              
            
        //     </Box>

        //   </Box>
        // )}
