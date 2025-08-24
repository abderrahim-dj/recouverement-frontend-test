import { useEffect, useState } from "react";
import { useForm, Controller, set } from "react-hook-form";



//function to accept the form data and send it to the server
import createNewUser from "../../services/createNewUser";

import ModalCard from "../../components/UI/ModalCard";

import { Box, Typography, TextField, Button, IconButton, InputAdornment, MenuItem } from '@mui/material';
import { VisibilityOff, Visibility } from "@mui/icons-material";

import WifiProtectedSetupOutlinedIcon from '@mui/icons-material/WifiProtectedSetupOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';



import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';

import useIsMobile from "../../hooks/useIsMobile";



export default function FormCreateUsers() {


  //check for the screen size
  const isMobile = useIsMobile();

  const [isLoading, setIsLoading] = useState(false);

  //for the password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const togglePasswordVisibility = () => {setShowPassword(prev => !prev)};
  const toggleConfirmPasswrordVisibility = () => {setShowConfirmPassword(prev => !prev)}




  //for modal 
  const [showModal,setShowModal]=useState(false);
  const [modalIcon,setModalIcon]=useState();
  const [modalColor, setModalColor] = useState();
  const [modalTitle, setModalTitle] = useState();

  //for showing the modal children
  const [showModalChildren, setShowModalChildren] = useState(false);


  //useForm hook configuration
  const { control, handleSubmit, formState: { errors } , getValues, setValue, reset, setError} = useForm({
  defaultValues: {
    first_name: '',
    last_name: '',
    password: '',
    password_confirmation: '',
    position: ''
  }
  });



  //funcion to handle the confirmation of the send money request

 const handleCorfirmSendCreate = async () => {

  setIsLoading(true);

  try {
    const response = await createNewUser({
      first_name: getValues('first_name'),
      last_name: getValues('last_name'),
      password: getValues('password'),
      "is_active": (getValues('position') === 'is_active' || getValues('position') === 'is_staff' || getValues('position') === 'is_superuser') ? true : false,
      "is_staff": (getValues('position') === 'is_staff' || getValues('position') === 'is_superuser') ? true : false,
      "is_superuser": (getValues('position') === 'is_superuser') ? true : false
    });

    console.log("Enregistrement réussi :", response);

    setShowModalChildren(false);
    setModalIcon(<CheckCircleOutlinedIcon fontSize='large' />);
    setModalColor('success');
    setModalTitle("L'enregistrement a été effectué avec succès");
    setShowModal(true);
    reset();

    // If you have setUserSelected, uncomment the next line:
    // setUserSelected(null);

  } catch (error) {
    console.error("Erreur d'enregistrement :", error);

    setShowModalChildren(false);
    setModalIcon(<InfoOutlinedIcon fontSize="large" />);
    setModalColor('danger');
    setModalTitle("Une erreur est survenue : le serveur n'a pas pu traiter la demande");
    setShowModal(true);
  } finally {
    setIsLoading(false);
  }
};









  const onSubmit = async (data) => {
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

    //the rest of the porsess
    //show the modal confirmation
    setShowModalChildren(true);
    setModalIcon(<InfoOutlinedIcon fontSize="large"/>);
    setShowModal(true);
    setModalColor('white');
    setModalTitle('Confirmation de l\'enregistrement');

  }


  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1, 
          padding: 3, 
          alignItems:'start',  
          placeSelf:'center', 
          width: isMobile ? '95%' : '35%',
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          paddingTop: 4,
          paddingBottom: 6,
          marginBottom:12
        }}
      >
       
       
       {/* The header */}
        <Box sx={{ 
            display: 'flex', 
            placeSelf: 'start', 
            gap: 2,
            mb: 2
          }}>
            <GroupAddOutlinedIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />
            <Typography 
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem' }, 
                fontWeight: 'bold', 
                color: 'text.primary' 
              }}
            >
              Enregistrer un nouveau utilisateur
            </Typography>
          </Box>


          {/* Fields */}

          {/* le nom of the worker */}
          <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
            Nom
          </Typography>
          
          
          <Controller
            name="last_name"
            control={control}
            rules={{ 
              required: "Le nom est requis",
              minLength: {
                value: 2,
                message: "Le nom doit comporter au moins 2 caractères"
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                type="text"
                inputProps={{ step: 'any', min: 0 }}
                label="Nom"
                placeholder="Entrez le Nom"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

            



          {/* le prenom of the worker */}
          <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
            Prenom
          </Typography>
          
          <Controller
            name="first_name"
            control={control}
            rules={{ 
              required: "Le prenom est requis",
              minLength: {
                value: 2,
                message: "Le prenom doit comporter au moins 2 caractères"
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                type="text"
                inputProps={{ step: 'any', min: 0 }}
                label="Prenom"
                placeholder="Entrez le Prenom"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />





          {/* position of the worker */}
          <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
            Position
          </Typography>
          
          <Controller
            name="position"
            control={control}
            rules={{
              required: "Le poste est requis",
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                select
                
                inputProps={{ step: 'any', min: 0 }}
                label="Poste"
                placeholder="Sélectionnez le poste"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                <MenuItem value="">Sélectionnez le poste</MenuItem>
                <MenuItem value="is_superuser">Administrateur</MenuItem>
                <MenuItem value="is_staff">Superviseur</MenuItem>
                <MenuItem value="is_active">Agent</MenuItem>

              </TextField>
            )}
          />





          {/* password of the worker */}
          <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
            Mot de passe
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
          <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
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
            marginTop: '4rem',
            textTransform: 'none'
          }}
          >
            	Enregistrer
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
              <Typography variant="h6" sx={{ mb: 2 }}>
                Détails de l'enregistrement
              </Typography>
              <Typography>
                <strong>Nom: </strong>
                {getValues('first_name')}
              </Typography>
              <Typography>
                <strong>Prenom: </strong>
                {getValues('last_name')}
              </Typography>
              <Typography>
                <strong>Position: </strong>
                {getValues("position") === 'is_superuser'
                  ? "Administrateur"
                  : getValues("position") === 'is_staff'
                    ? "Agent"
                    : getValues("position") === 'is_active'
                      ? "Agent"
                      : "Position inconnue"
                }
              </Typography>

                
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'right',
                  marginTop: '2rem',
                  gap: 2
                }}>

                  <Button
                    variant="contained"
                    color="success"
                    loading={isLoading}
                    disabled={isLoading}
                    onClick={() => {
                      console.log('clicked and confirmed');
                      handleCorfirmSendCreate();
                    }}
                    sx={{
                      textTransform: 'none',
                    }}
        
                    >
                    Confirmer
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      console.log('clicked and cancelled');
                      setShowModal(false);
                      reset();
                    }}
                    sx={{
                      textTransform: 'none'
                    }}
                  >
                    Annuler
                  </Button>
                </Box>

            </Box>
          </>
        )  
        }

      </ModalCard>
    </>
  )

}