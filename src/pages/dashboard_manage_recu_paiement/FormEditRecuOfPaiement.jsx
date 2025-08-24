import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Box, Button, Typography, TextField, CircularProgress,
  Dialog, DialogActions, DialogContent, DialogTitle,
  Alert, Snackbar, Paper
} from '@mui/material';
import { styled } from '@mui/system';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { visuallyHidden } from '@mui/utils';
import ModalCard from '../../components/UI/ModalCard';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';


import editCompanyRecuOfPaiement from '../../services/editCompanyRecuOfPaiement';
import newCompanyRecuOfPaiement from '../../services/newCompanyRecuOfPaiement';

import useIsMobile from '../../hooks/useIsMobile';

// You'll need to create this service
// import updateCompanyInfo from '../../services/updateCompanyInfo';



const FormWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  maxWidth: '800px',
  margin: '0 auto',
}));

const FormSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(0),
}));

const FormRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const VisuallyHiddenInput = styled('input')({
  ...visuallyHidden,
});

export default function FormEditRecuOfPaiement({ 
  companyData, 
  onSuccess, 
  onCancel, 
  inModal = true,
  isEdit,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  

  // for ModalCard
  const [modalColor, setModalColor] = useState();
  const [modalTitle, setModalTitle] = useState();
  const [modalIcon, setModalIcon] = useState();
  const [showModal, setShowModal] = useState();


  const isMobile = useIsMobile();

  const [loading, setIsLoading] = useState(false);




  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: companyData?.name || '',
      adress: companyData?.adress || '',
      phone: companyData?.phone || '',
      email: companyData?.email || '',
      logo: companyData?.logo || '',
      RC: companyData?.RC || '',
      NIF: companyData?.NIF || '',
      NIS: companyData?.NIS || '',
      N_article: companyData?.N_article || '',
      RIB: companyData?.RIB || '',
    },
  });

  const handleCancel = () => {
    if (isDirty || selectedFile) {
      setShowCancelDialog(true);
    } else {
      onCancel();
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    onCancel();
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview URL for the selected image
      const fileUrl = URL.createObjectURL(file);
      setValue('logo', fileUrl, { shouldDirty: true });
    }
  };






  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError(null);
    
    try {
      // Create form data if there's a file to upload
      const formData = new FormData();
      
      Object.keys(data).forEach(key => {
        // Skip the logo field, we'll handle it separately
        if (key !== 'logo') {
          formData.append(key, data[key]);
        }
      });


      // Add file if it exists
      if (selectedFile) {
        formData.append('logo', selectedFile);
      } else if (data.logo && data.logo.startsWith('http')) {
        // If using existing logo URL, pass it as a string field
        formData.append('logo_url', data.logo);
      }




      // Here you would call your API service
      

      const response = isEdit ?  
        // If editing, use the edit service
        await editCompanyRecuOfPaiement(formData, companyData.id) 
        :
        // if is not editing meaning creating a new recu of paiement
        await newCompanyRecuOfPaiement(formData)
   

      if (!response) {      const response = isEdit ?  
        // If editing, use the edit service
        await editCompanyRecuOfPaiement(formData, companyData.id) 
        :
        // if is not editing meaning creating a new recu of paiement
        await newCompanyRecuOfPaiement(formData)
        setModalColor('danger');
        setModalTitle('Erreur');
        setModalIcon(<ErrorOutlineOutlinedIcon fontSize='large' />);
        setShowModal(true);
        throw new Error('Failed to update company recu of paiement');
      }


      // For now, we'll just log the data and simulate success
      console.log('Form submitted with data:', formData || submitData);

      // Reset the form with the new data
      reset(data);
      setSelectedFile(null);
      
      // Call the success callback after a short delay
      if (onSuccess) {

        setModalColor('success');
        setModalTitle('Succès');
        setModalIcon(<CheckCircleOutlineOutlinedIcon fontSize='large' />);
        setShowModal(true);


        setTimeout(() => {
          onSuccess(data);
        }, 1000);
      }
    } catch (error) {

      setModalColor('danger');
      setModalTitle('Erreur');
      setModalIcon(<ErrorOutlineOutlinedIcon fontSize='large' />);
      setShowModal(true);


      console.error('Error updating company info:', error);
      setApiError(error.message || 'Une erreur est survenue lors de la mise à jour');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <>
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <FormWrapper component="form" onSubmit={handleSubmit(onSubmit)} >
          
          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}
          
          <FormSection sx={{gap:'16px'}}>
            <Typography variant="subtitle1" fontWeight="bold" fontSize={'1rem'}>
              Informations générales
            </Typography>
            
            <TextField
              label="Nom de la compagnie"
              fullWidth
              {...register('name', { 
                required: 'Le nom de la compagnie est obligatoire',
                maxLength: {
                  value: 100,
                  message: 'Le nom ne peut pas dépasser 100 caractères'
                }
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            
            <TextField
              label="Adresse"
              fullWidth
              
              
              {...register('adress', { 
                required: 'L\'adresse est obligatoire',
              })}
              error={!!errors.adress}
              helperText={errors.adress?.message}
            />
            
            <FormRow>
              <TextField
                label="Téléphone"
                fullWidth
                {...register('phone', { 
                  required: 'Le numéro de téléphone est obligatoire',
                  pattern: {
                    value: /^[0-9+\-\s()]*$/,
                    message: 'Format de téléphone invalide'
                  }
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
              
              <TextField
                label="Email"
                fullWidth
                {...register('email', { 
                  required: 'L\'email est obligatoire',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Format d\'email invalide'
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </FormRow>
            
            <Box>
              <Typography variant="body2" sx={{fontWeight: 'bold', fontSize: '1rem',marginY:'16px'}} gutterBottom>
                Logo de l'entreprise
              </Typography>
              
              <Box sx={{ mb: 2, mt: 1, border: '1px dashed #ccc', p: 2, borderRadius: 1 }}>
                {(companyData?.logo || selectedFile) && (
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <img 
                      src={selectedFile ? URL.createObjectURL(selectedFile) : companyData?.logo} 
                      alt="Logo de l'entreprise" 
                      style={{ maxWidth: isMobile ? '150px' : '200px', maxHeight: '100px' }} 
                    />
                  </Box>
                )}
                

                
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{
                    textTransform: 'none',
                    
                  }}

                >
                  {selectedFile || companyData?.logo ? 'Changer de logo' : 'Télécharger un logo'}
                  <VisuallyHiddenInput 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>
            </Box>
          </FormSection>
          
          <FormSection sx={{gap:'16px'}}>
            <Typography variant="subtitle1" fontWeight="bold" fontSize={'1rem'}>
              Informations légales
            </Typography>
            
            <FormRow>
              <TextField
                label="Registre de Commerce (RC)"
                fullWidth
                {...register('RC', { 
                  required: 'Le RC est obligatoire',
                })}
                error={!!errors.RC}
                helperText={errors.RC?.message}
              />
              
              <TextField
                label="Numéro d'Identification Fiscale (NIF)"
                fullWidth
                {...register('NIF', { 
                  required: 'Le NIF est obligatoire',
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Format NIF invalide (chiffres uniquement)'
                  }
                })}
                error={!!errors.NIF}
                helperText={errors.NIF?.message}
              />
            </FormRow>
            
            <FormRow>
              <TextField
                label="Numéro d'Identification Statistique (NIS)"
                fullWidth
                {...register('NIS', { 
                  required: 'Le NIS est obligatoire',
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Format NIS invalide (chiffres uniquement)'
                  }
                })}
                error={!!errors.NIS}
                helperText={errors.NIS?.message}
              />
              
              <TextField
                label="Numéro d'article"
                fullWidth
                {...register('N_article', { 
                  required: 'Le numéro d\'article est obligatoire',
                })}
                error={!!errors.N_article}
                helperText={errors.N_article?.message}
              />
            </FormRow>
            
            <TextField
              label="Relevé d'Identité Bancaire (RIB)"
              fullWidth
              {...register('RIB', { 
                required: 'Le RIB est obligatoire',
              })}
              error={!!errors.RIB}
              helperText={errors.RIB?.message}
            />
          </FormSection>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2, flexDirection: isMobile ? 'column' : 'row' }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="success"
              disabled={isSubmitting}
              loading={isSubmitting}
              sx={{ textTransform: 'none' }}

            >
              {
                isEdit ? 'Enregistrer les modifications' : 'Créer un nouveau recu de paiement'
              }
              
            </Button>
           
            <Button 
              variant="contained" 
              color='error'
              onClick={handleCancel}
              disabled={isSubmitting}
              sx={{ textTransform: 'none' }}
            >
              Annuler
            </Button>

          </Box>
        </FormWrapper>
      </Paper>
      
    

      {/* Modal for inModal prop */}
      
      <ModalCard
        showModal={showModal}
        setShowModal={setShowModal}
        title={modalTitle}
        color={modalColor}
        icon={modalIcon}
      /> 
        


    </>
  );
}