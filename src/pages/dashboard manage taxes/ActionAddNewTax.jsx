import ModalCard from '../../components/UI/ModalCard';
import { useState } from 'react';
import SyncLockOutlinedIcon from '@mui/icons-material/SyncLockOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';

//for the form
import { useForm, Controller, set } from "react-hook-form";
import { Box, Typography, TextField, Button, IconButton, InputAdornment, MenuItem } from '@mui/material';
import { VisibilityOff, Visibility } from "@mui/icons-material";


//functions for sending the request to the API
import createNewTax from '../../services/createNewTax';


import useIsMobile from '../../hooks/useIsMobile';


export default function ActionAddNewTax({openModal, onClose, onTaxCreated }) {


  const [isLoading, setIsLoading] = useState(false);

  const isMobile = useIsMobile()

  //sate for the modal
  const [showModal, setShowModal] = useState(openModal);
  const [modalTitle, setModalTitle] = useState("Ajuter une taxe");
  const [modalIcon, setModalIcon] = useState(<LibraryAddOutlinedIcon fontSize='large'/>);
  const [modalColor, setModalColor] = useState("white");
  const [modalChildren, setModalChildren] = useState(true);


  //useForm hook configuration
  const { control, handleSubmit, formState: { errors } , getValues, setValue, reset, setError} = useForm({
  defaultValues: {
    tax_name: '',
  }
  });



  const onSubmit = async (data) => {
    setIsLoading(true);
  console.log('Form data submitted for modifie tax name:', data);

  

  console.log('modal childern before:', modalChildren);
  
  //preparing the data to send to the API
  const requestData = {
    tax_name: data.tax_name.trim(),
    created_by: localStorage.getItem('user_id'),

  }

  console.log('requestData:', requestData);

  //check if the first name and last name are not the same as the current ones
  if (data.tax_name.trim() === '') {
    setError("tax_name", {
      type: "manual",
      message: "Le nom de la taxe ne peut pas être vide.",
    });
    return;
  }
  

  //send the request to the API
  try {
    const response = await createNewTax(requestData);
    console.log('Response from changeUserUsername:', response);
    //if the response is ok, show the confirmation modal
    if (response) {
      setModalChildren(false);
      setModalIcon(<CheckCircleOutlinedIcon fontSize="large"/>);
      setModalColor('success');
      setModalTitle('Nom créé avec succès');
      reset(); // Reset the form fields

      console.log('modal childern after:', modalChildren);

      //update the user in the table component
      //dir ta3 modified by and fix it
      onTaxCreated({
        id: response.id,
        tax_name: response.tax_name,
        created_by_full_name: response.created_by_full_name,
        created_at: response.created_at,
        last_updated: response.last_update,
        modefied_by_full_name: response.modefied_by_full_name,
      })

      return;
    }

  } catch (error) {
    console.log('Error in changeUserUsername:', error);
    //if there is an error, show the error modal
    setModalChildren(false);
    setModalIcon(<FeedbackOutlinedIcon fontSize="large"/>);
    setModalColor('danger');
    setModalTitle('La création a échoué : le nom est peut-être déjà utilisé ou une erreur serveur est survenue.');
    return;
    
  } finally {
    setIsLoading(false);
  }

  //the rest of the porsess
  //show the modal confirmation
  //setShowModalChildren(true);
  // setModalIcon(<InfoOutlinedIcon fontSize="large"/>);
  // setShowModal(true);
  // setModalColor('neutral');
  // setModalTitle('Confirmation de l\'enregistrement');


  }





  return (
    <ModalCard
      title={modalTitle} 
      showModal={openModal} 
      setShowModal={onClose} 
      icon ={modalIcon} 
      color={modalColor}
    >
      { modalChildren && (
        <>
{ modalChildren && (
        <>

          



        <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: isMobile ? 1 : 2, 
          padding: 3, 
          alignItems:'start',  
          placeSelf:'center', 
          width: isMobile ? '100%': '30vw',
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          paddingTop: 4,
          paddingBottom: 4,
          marginBottom:0,
          marginTop: 2,
        }}
      >
      


          {/* Fields */}

          {/* tax name change */}

          <Typography sx={{fontSize: isMobile ? '1rem': '1.3rem', fontWeight:'bold'}}>
            Nom de taxe
          </Typography>

          <Controller
          name='tax_name'
          control={control}
          rules={{
            required: 'Le nom de la taxe est requis',
            minLength: {
              value: 2,
              message: 'Le nom de la taxe doit comporter au moins 2 caractères'
            },
          }}
          
          render={({ field, fieldState}) => (
            <TextField
              {...field}
              fullWidth
              type='text'
              label='Nom de taxe'
              placeholder='Entrez le nom de la taxe'
              variant='outlined'
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
          >


          </Controller>




          <Button
          type="submit"
          variant="contained"
          color="error"
          sx={{
            width: '100%',
            marginTop: '2rem',
            textTransform: 'none',
          }}
          loading={isLoading}
          disabled={isLoading}
          >
              Ajoutez un nom de taxe 
          </Button>
      </Box>




        </>
      )

      }
        </>
      )

      }
    </ModalCard>
  );
}