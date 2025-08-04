import ModalCard from '../../components/UI/ModalCard';
import { useState } from 'react';
import SyncLockOutlinedIcon from '@mui/icons-material/SyncLockOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

//for the form
import { useForm, Controller, set } from "react-hook-form";
import { Box, Typography, TextField, Button, IconButton, InputAdornment, MenuItem } from '@mui/material';
import { VisibilityOff, Visibility } from "@mui/icons-material";


//functions for sending the request to the API
import changeUserUsername from '../../services/changeUserUsername';


import useIsMobile from '../../hooks/useIsMobile';


export default function ActionChangeUsername({ user, openModal, onClose, onUsernameUpdate }) {

  const [isLoading, setIsLoading] = useState(false);


  const isMobile = useIsMobile()


  //sate for the modal
  const [showModal, setShowModal] = useState(openModal);
  const [modalTitle, setModalTitle] = useState("Changer le nom de l'employé");
  const [modalIcon, setModalIcon] = useState(<BadgeOutlinedIcon fontSize='large'/>);
  const [modalColor, setModalColor] = useState("white");
  const [modalChildren, setModalChildren] = useState(true);


  //useForm hook configuration
  const { control, handleSubmit, formState: { errors } , getValues, setValue, reset, setError} = useForm({
  defaultValues: {
    first_name:  user.first_name || '',
    last_name: user.last_name || '',
  }
  });



  const onSubmit = async (data) => {

  setIsLoading(true);

  console.log('Form data submitted for creating user:', data);

  

  console.log('modal childern before:', modalChildren);
  
  //preparing the data to send to the API
  const requestData = {
    first_name: data.first_name,
    last_name: data.last_name,
    user_id: user.id, // Assuming user.id is the ID of the user to be updated
  }

  //check if the first name and last name are not the same as the current ones
  if (data.first_name.trim() === user.first_name && data.last_name.trim() === user.last_name) {
    setError("first_name", {
      type: "manual",
      message: "le nom et prenom ne peuvent pas être les mêmes que les actuels.",
    });
    setError("last_name", {
      type: "manual",
      message: "Le nom et prenom ne peuvent pas être les mêmes que les actuels.",
    });
    return;
  }
  

  //send the request to the API
  try {
    const response = await changeUserUsername(requestData);
    console.log('Response from changeUserUsername:', response);
    //if the response is ok, show the confirmation modal
    if (response) {
      setModalChildren(false);
      setModalIcon(<CheckCircleOutlinedIcon fontSize="large"/>);
      setModalColor('success');
      setModalTitle('Nom et modifier avec succès');
      reset(); // Reset the form fields

      console.log('modal childern after:', modalChildren);

      //update the user in the table component
      onUsernameUpdate({
        id:user.id,
        username: response.new_username,
        first_name:data.first_name,
        last_name:data.last_name,
      })

      return;
    }

  } catch (error) {
    console.log('Error in changeUserUsername:', error);
    //if there is an error, show the error modal
    setModalChildren(false);
    setModalIcon(<FeedbackOutlinedIcon fontSize="large"/>);
    setModalColor('danger');
    setModalTitle('Échec de la modification du nom');
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
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0
        }}>

          <Typography><strong>Changer le mot de pass pour: </strong>{user.first_name} {user.last_name}</Typography>
          <Typography><strong>Nom: </strong>{user.last_name}</Typography>
          <Typography><strong>Prenom: </strong>{user.first_name}</Typography>
          <Typography><strong>Position: </strong>{
            user.is_superuser
              ? 'Administrateur'
              : user.is_staff
                ? 'Superviseur'
                : user.is_active
                  ? 'Travailleur'
                  : 'Inactif'
            }</Typography>
        </Box>
          



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
          overflowY: 'auto',
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          paddingTop: 2,
          paddingBottom: 4,
          marginBottom:0,
          marginTop: 2,
        }}
      >
      


          {/* Fields */}


          {/* password of the worker */}
          <Typography sx={{fontSize: isMobile ? '1rem' : '1.3rem', fontWeight: 'bold'}}>
            Nom
          </Typography>
          
          <Controller
            name="last_name"
            control={control}
            rules={{ 
              required: "Le Nom est requis",
              minLength: {
                value: 2,
                message: "Le Nom doit comporter au moins 8 caractères"
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                type={'text'}
                inputProps={{ step: 'any', min: 0 }}
                label="Nom"
                placeholder="Entrez le Nom"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                defaultValue={user.last_name || ''} // Set default value from user object
              
              />
            )}
          />



          {/* confirm password of the worker */}
          <Typography sx={{fontSize: isMobile ? '1rem' :'1.3rem', fontWeight: 'bold'}}>
            Prenom
          </Typography>
          
          <Controller
            name="first_name"
            control={control}
            rules={{ 
              required: "Le Prenom est requis",
              minLength: {
                value: 2,
                message: "Le Prenom doit comporter au moins 2 caractères"
              },

            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                type={'text'}
                inputProps={{ step: 'any', min: 0 }}
                label="Prenom"
                placeholder="Entrez le Prenom"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                //defaultValue={user.first_name || ''} // Set default value from user object

              />
            )}
          />




          <Button
          type="submit"
          variant="contained"
          color="error"
          loading={isLoading}
          disabled={isLoading}
          sx={{
            width: '100%',
            marginTop: '2rem',
            textTransform: 'none'
          }}
          >
            	Changer le nom 
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