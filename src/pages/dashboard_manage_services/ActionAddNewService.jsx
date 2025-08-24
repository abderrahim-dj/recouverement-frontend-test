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
import createNewService from '../../services/createNewService';


import useIsMobile from '../../hooks/useIsMobile';

export default function ActionAddNewService({openModal, onClose, onServiceCreated }) {


  const [loading, setLoading] = useState(false);

  const isMobile = useIsMobile();

  //sate for the modal
  const [showModal, setShowModal] = useState(openModal);
  const [modalTitle, setModalTitle] = useState("Ajuter un service");
  const [modalIcon, setModalIcon] = useState(<LibraryAddOutlinedIcon fontSize='large'/>);
  const [modalColor, setModalColor] = useState("white");
  const [modalChildren, setModalChildren] = useState(true);


  //useForm hook configuration
  const { control, handleSubmit, formState: { errors } , getValues, setValue, reset, setError} = useForm({
  defaultValues: {
    service_name: '',
  }
  });



  const onSubmit = async (data) => {
    setLoading(true);
  console.log('Form data submitted for modifie service name:', data);

  

  console.log('modal childern before:', modalChildren);
  
  //preparing the data to send to the API
  const requestData = {
    service_name: data.service_name.trim(),
    created_by: localStorage.getItem('user_id'),

  }

  console.log('requestData:', requestData);

  //check if the first name and last name are not the same as the current ones
  if (data.service_name.trim() === '') {
    setError("service_name", {
      type: "manual",
      message: "Le nom du service ne peut pas être vide.",
    });
    return;
  }
  

  //send the request to the API
  try {
    const response = await createNewService(requestData);
    console.log('Response from changeUserUsername:', response);
    //if the response is ok, show the confirmation modal
    if (response) {
      setModalChildren(false);
      setModalIcon(<CheckCircleOutlinedIcon fontSize="large"/>);
      setModalColor('success');
      setModalTitle('Nom et créé avec succès');
      reset(); // Reset the form fields

      console.log('modal childern after:', modalChildren);

      //update the user in the table component
      //dir ta3 modified by and fix it
      onServiceCreated({
        id: response.id,
        service_name: response.service_name,
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
    setLoading(false);
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
          width: isMobile ? '100%' : '30vw',
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          paddingTop: 4,
          paddingBottom: 6,
          marginBottom:4,
          marginTop: 2,
        }}
      >
      


          {/* Fields */}

          {/* service name change */}

          <Typography sx={{fontSize:'1.3rem', fontWeight:'bold'}}>
            Nom de service
          </Typography>

          <Controller
          name='service_name'
          control={control}
          rules={{
            required: 'Le nom du service est requis',
            minLength: {
              value: 2,
              message: 'Le nom du service doit comporter au moins 2 caractères'
            },
          }}
          
          render={({ field, fieldState}) => (
            <TextField
              {...field}
              fullWidth
              type='text'
              label='Nom de service'
              placeholder='Entrez le nom du service'
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
          disabled={loading}
          loading={loading}
          >
              Changer le nom du service
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