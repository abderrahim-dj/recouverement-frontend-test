import ModalCard from '../../components/UI/ModalCard';
import { useState } from 'react';
import SyncLockOutlinedIcon from '@mui/icons-material/SyncLockOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';


//for the form
import { useForm, Controller, set } from "react-hook-form";
import { Box, Typography, TextField, Button, IconButton, InputAdornment, MenuItem } from '@mui/material';
import { VisibilityOff, Visibility } from "@mui/icons-material";


//functions for sending the request to the API
import changeUserPassword from '../../services/changeUserPassword';

import useIsMobile from '../../hooks/useIsMobile';


export default function ActionChangePassword({ user, openModal, onClose }) {


  const [isLoading, setIsLoading] = useState(false);

  const isMobile = useIsMobile();

  //sate for the modal
  const [showModal, setShowModal] = useState(openModal);
  const [modalTitle, setModalTitle] = useState("Changer le mot de passe");
  const [modalIcon, setModalIcon] = useState(<SyncLockOutlinedIcon fontSize='large'/>);
  const [modalColor, setModalColor] = useState("white");
  const [modalChildren, setModalChildren] = useState(true);



  //for the password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const togglePasswordVisibility = () => {setShowPassword(prev => !prev)};
  const toggleConfirmPasswrordVisibility = () => {setShowConfirmPassword(prev => !prev)}



  //useForm hook configuration
  const { control, handleSubmit, formState: { errors } , getValues, setValue, reset, setError} = useForm({
  defaultValues: {
    password: '',
    password_confirmation: '',
  }
  });



  const onSubmit = async (data) => {
  
  setIsLoading(true);
    console.log('Form data submitted for creating user:', data);

  //check if the passwords match
  if (data.password !== data.password_confirmation) {
    setError('password_confirmation', {
      type: 'manual',
      message: 'Les mots de passe ne correspondent pas'
    });

    setError('password', {
      type: 'manual',
      message: 'Les mots de passe ne correspondent pas'
    });
    return;
  }

  
  //form the data to send to the API
  const formData = {
    user_id: user.id,
    new_password: data.password,
  }

  console.log('modal childern before:', modalChildren);
  

  //send the request to the API
  try {
    const response = await changeUserPassword(formData);
    console.log('Response from changeUserPassword:', response);
    //if the response is ok, show the confirmation modal
    if (response) {
      setModalChildren(false);
      setModalIcon(<CheckCircleOutlinedIcon fontSize="large"/>);
      setModalColor('success');
      setModalTitle('Mot de passe changé avec succès');
      reset(); // Reset the form fields

      console.log('modal childern after:', modalChildren);

      return;
    }

  } catch (error) {
    console.log('Error in changeUserPassword:', error);
    //if there is an error, show the error modal
    setModalChildren(false);
    setModalIcon(<FeedbackOutlinedIcon fontSize="large"/>);
    setModalColor('danger');
    setModalTitle('Erreur lors du changement de mot de passe');
    return;
    
  }finally {
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
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap:0
        }}>

          <Typography><strong>Changer le mot de pass pour: </strong>{user.first_name} {user.last_name}</Typography>
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
          width: isMobile ? '100%':'30vw',
          overflowY: 'auto',
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          paddingTop: 2,
          paddingBottom: 6,
          marginBottom:0,
          marginTop: 2,
        }}
      >
      


          {/* Fields */}


          {/* password of the worker */}
          <Typography sx={{fontSize: isMobile ? '1rem' : '1.3rem', fontWeight: 'bold'}}>
            Nouveau mot de passe
          </Typography>
          
          <Controller
            name="password"
            control={control}
            rules={{ 
              required: "Le password est requis",
              minLength: {
                value: 8,
                message: "Le password doit comporter au moins 8 caractères"
              },
              pattern: {
                value: /[^A-Za-z0-9]/,
                message: "Le mot de passe doit contenir au moins un symbole"
              }
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                type={showPassword ? 'text' : "password"}
                inputProps={{ step: 'any', min: 0 }}
                label="Mot de passe"
                placeholder="Entrez le Mot de passe"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                InputProps={{
                  endAdornment : (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            )}
          />



          {/* confirm password of the worker */}
          <Typography sx={{fontSize: isMobile ? '1rem':'1.3rem', fontWeight: 'bold'}}>
            Confirmer mot de passe
          </Typography>
          
          <Controller
            name="password_confirmation"
            control={control}
            rules={{ 
              required: "Le password est requis",
              minLength: {
                value: 8,
                message: "Le password doit comporter au moins 8 caractères"
              },
              pattern: {
                value: /[^A-Za-z0-9]/,
                message: "Le mot de passe doit contenir au moins un symbole"
              }
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                type={showConfirmPassword ? 'text' : "password"}
                inputProps={{ step: 'any', min: 0 }}
                label="Mot de passe"
                placeholder="Entrez le Mot de passe"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                InputProps={{
                  endAdornment : (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleConfirmPasswrordVisibility} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            )}
          />




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
            	Changer mot de passe
          </Button>
      </Box>




        </>
      )

      }
    </ModalCard>
  );
}