import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import { Box, Divider, Option, Select, Typography, Modal, ModalDialog, ModalClose} from "@mui/joy";
import { Button, IconButton, List, ListItem, ListItemText, Paper, TextField, MenuItem } from "@mui/material";
import React, { use, useEffect, useRef, useState } from 'react';
import { Controller, set, useForm } from 'react-hook-form';
import SideNavbar from "../../components/UI/SideNavbar";

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ModalCard from '../../components/UI/ModalCard';

import { useLocation } from 'react-router-dom';

import getCustomerInfoForPay from '../../services/getCustomerinfoForPay';


import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PrintIcon from '@mui/icons-material/Print';

//my custom authHook
import useAuth from '../../hooks/useAuth';

//function that will calculate the left ammount
import calculateTheLeftAmmount from '../../utils/calculateTheLeftAmmount';

import postCustomerPay from '../../services/postCustomerPay';

import ComboTextInput from '../../components/UI/ComboTextInput';


import UserLogged from '../../components/UI/UserLogged';


//import the plus button for adding new tax that are alredy added by the superuser
import PlusButtonForAddingTax from '../../components/UI/PlusButtonForAddingTax';


//import the function that will fetch the list of taxs
import getAllListOfTaxs from '../../services/getAllListOfTaxs';

// import the tax adding from component
import TaxAddingForm from '../../components/UI/TaxAddingForm';
import { Key } from '@mui/icons-material';


//function to check if the customer has a negative amount after deductions
import hasNegativeAfterDeduction from '../../services/hasNegativeAfterDeduction';



import useIsMobile from '../../hooks/useIsMobile';



import DashboardNewCustomer from '../dashboard new customer/DashboardNewCustomer'



import InputClientIdPay from './InputClinetIdPay';
import ShowCustomerSelectedData from './ShowCustomerSelecedData';
import InputCustomerActionPay from './InputCustomerActionPay';

import generateReceiptPDF from '../../services/generateReceiptPDF';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function DashboardPay() {

  //my custom hook to check if the user is authenticated or not
  useAuth();
  const isMobile = useIsMobile();

  const [customerName, setCustomerName] = useState('');
  const [customerSelectedData, setCustomerSelectedData] = useState();

  //state to handle opening the modal for registering a new customer
  const [openRegisterModal, setOpenRegisterModal] = useState(false);


  //state to store the list of taxs
  const [allTaxsList, setAllTaxsList] = useState([])

  //state to store the list of available taxs
  //this will be the taxs that are available to be selected by the user
  const [listOfAvailableTaxs, setListOfAvailableTaxs] = useState([]);




  //for loading state when printing the PDF for the receipt
  const [pdfLoading, setPdfLoading] = useState(false);

  //state to handle the loading state of the confirm pay button
  const [isLoadingConfirmPay, setIsLoadingConfirmPay] = useState(false);




  useEffect(() => {
    console.log('listOfAvailableTaxs:', listOfAvailableTaxs);
    
  }, [listOfAvailableTaxs]);

  //state to store the list of taxs that are selected by the user
  const [selectedTaxs, setSelectedTaxs] = useState([]);

  
  const { control, handleSubmit, formState: { errors }, setValue, getValues, reset, unregister  } = useForm({
    defaultValues: {
      //customer:'',
      user_id: '',
      pay_method: '',
      receipt_img: null
    }
  });




  //useEffect to fetch the list of taxs when laoding the component
  useEffect(() => {
    //fetch the list of taxs from the server
    const fetchListOfTaxs = async () => {
      try {
        const taxsList = await getAllListOfTaxs();
        setAllTaxsList(taxsList); //stoer all the original taxs list
        setListOfAvailableTaxs(taxsList); //initially set the available taxs to all taxs

      } catch (error) {
        console.error("Error fetching list of taxs:", error);
        setModalIcon(<ReportOutlinedIcon fontSize='large'/>);
        setModalColor('danger');
        setModalTitle('Error fetching list of taxs');
        setShowModal(true);
        
      }
    }

    fetchListOfTaxs();
  }, [])
  


  //useEffect to log the customerSelectedData when it changes
  useEffect(() => {
    console.log('customerSelectedData form pay :',customerSelectedData);

  }, [customerSelectedData]);
    









  // useEffect to filter the list of available taxs based on the selected customer
useEffect(() => {
  if (customerSelectedData && allTaxsList.length > 0) {
    // Reset selected taxes when customer changes
    setSelectedTaxs([]);
    
    // Reset the actions field array
    reset({ 
      ...getValues(),
      actions: [] // Clear all actions 
    });

    // Get customer's tax IDs
    const customerTaxIds = customerSelectedData.customertaxtracking_set.map(tax => tax.tax);
    
    console.log('customerTaxIds:', customerTaxIds);
    
    // Filter available taxes to only show customer's taxes
    const customerAvailableTaxes = allTaxsList.filter(tax => 
      customerTaxIds.includes(tax.id)
    );
    
    setListOfAvailableTaxs(customerAvailableTaxes);
  } 
  
  else if (!customerSelectedData) {
    // Reset to the original list when no customer is selected
    setListOfAvailableTaxs(allTaxsList);
    setSelectedTaxs([]);
    
    // Also reset actions when customer is deselected
    reset({
      ...getValues(),
      actions: []
    });
  }
}, [customerSelectedData, allTaxsList]);











  //function to get the customer info from database if the user id is set in the input field
  


  //useEffect to log the user_id when it changes
  useEffect(() => {
    if (getValues('user_id')) {
      console.log('getValues user_id :', getValues('user_id'));
      
    }
  },[getValues('user_id')]);
  

  //useEffect to log the customerSelectedData when it changes
  useEffect(() => {
    console.log('customer selected data changed:', customerSelectedData);
    
  }), [customerSelectedData]
  

  //fetch user data if we select a user by his id to show the box in the right that show customer current credits
  useEffect(() => {
    if (getValues('user_id')) {

      console.log('run the fetch cause the user id is set');
      

      const fetchCustomerInfo = async () => {
        //fetch the user data from my database
        const customerInfo = await getCustomerInfoForPay({user_id: getValues('user_id')});
        setCustomerSelectedData({
          ...customerInfo.customer, 
          customertaxtracking_set: customerInfo.customertaxtracking_set
        });
        console.log('fetch customerinfo by id :', customerInfo.customer);
        
      }
      fetchCustomerInfo();
    }
  }, []);



  // useEffect to filter the list of available taxs based on the selected customer
  useEffect(() => {
    if (customerSelectedData && allTaxsList.length > 0) {

      //Reset selected taxes when customer changes
      setSelectedTaxs([]);

      // Get customer's tax IDs
      const customerTaxIds = customerSelectedData.customertaxtracking_set.map(tax => tax.tax);
      
      console.log('customerTaxIds:', customerTaxIds);
      

      // Filter available taxes to only show customer's taxes
      const customerAvailableTaxes = allTaxsList.filter(tax => 
        customerTaxIds.includes(tax.id)
      );
      
      setListOfAvailableTaxs(customerAvailableTaxes);
    } 
    
    else if (!customerSelectedData) {
      //reset to the original list when no customer is selected
      setListOfAvailableTaxs(allTaxsList);
      setSelectedTaxs([]);
    }
  }, [customerSelectedData, allTaxsList]);




  //useEffect to reset the form when the url changes
  const location = useLocation();

  //useEffect to reset the form when the url changes
  useEffect(()=>{
    const searchParams = new URLSearchParams(location.search);
    const customerId = searchParams.get('id');
    
    console.log('url changed');
    

    //clear the old value
    setValue('user_id', '');
    setValue('receipt_img', null);

    //clear the img
    if (img) {
      URL.revokeObjectURL(img);
      setImg(null);
    }

    //Reset other state
    setCustomerName(''); 
    setCustomerInfoData(null);
    setAmmountLeft(null);
    setFormData(null);

    
    //set new value from url
    if (customerId) {
      setValue('user_id', customerId);
      setCustomerName(searchParams.get('name'));



  

      console.log('customerId', customerId);
      console.log('customerName', searchParams.get('name'));
      
    }
  }, [location.search])




  //some states to handle the image upload and errors
  const [img, setImg] = useState(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);


  //states for the modal
  const [showModal,setShowModal]=useState(false);
  const [modalIcon,setModalIcon]=useState();
  const [modalColor, setModalColor] = useState();
  const [modalTitle, setModalTitle] = useState();


  //state to store the customer info data
  const [customerInfoData, setCustomerInfoData] = useState();
  const [ammountLeft, setAmmountLeft] = useState();
  const [formData, setFormData] = useState()



  /* on submit function */
  const onSubmit = async (data) => {

    console.log('form data on submit:', data);


    try {
      
      const formDataGet = {
        ...data,
        //user_id: parseInt(data.user_id),
        //customer: parseInt(data.user_id),

      };


      

      console.log('formDataGet ', formDataGet)
      
      // customerTaxIds.includes(tax.id)
      setFormData(formDataGet);

      //fetch the user data from my database
      const customerInfo = await getCustomerInfoForPay(formDataGet);

      setCustomerInfoData(customerInfo);

      console.log('customerInfo ', customerInfo);
      console.log('customerInfoData ', customerInfoData);
      
      //if the fetch done successfully
      if (customerInfo) {
        setModalIcon(<InfoOutlinedIcon fontSize='large'/>)
        setModalColor('white')
        setModalTitle('information');
        
        //update data to the database of el baraka
        //console.log('cutomer id for the update', customerInfo.customer.customer_id);
        //console.log('customer apport for the update', customerInfo.customer.customer_apport_personnel_current);
        
        //updateCustomerApportInOtherDataBase()


        const customerAmmountLeft = calculateTheLeftAmmount(formDataGet, customerInfo);
        setAmmountLeft(customerAmmountLeft);
        

        setShowModal(true);

      }else{
        //if the fetch failed

        setAmmountLeft();
        setCustomerInfoData();

        setModalIcon(<ReportProblemOutlinedIcon fontSize='large'/>)
        setModalColor('danger')
        setModalTitle("impossible de trouver le client avec cet ID, enregistrez-le d'abord.");
        setShowModal(true);
      }


      /*       
      console.log("Form data:", formData);
      setModalIcon(<CheckCircleOutlinedIcon fontSize='large'/>)
      setModalColor('success');
      setModalTitle('Success');
      setShowModal(true);
      */

    } catch (error) {
      setModalIcon(<ReportProblemOutlinedIcon fontSize='large'/>)
      setModalColor('danger')
      setModalTitle('Erreur sur le serveur');
      setShowModal(true);
      console.error("Submission error:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFileError(''); // Reset error message
    
    if (file) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setFileError('Only JPEG and PNG files are allowed');
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setValue("receipt_img", null);
        return;
      }

      // Set the image preview
      const imageUrl = URL.createObjectURL(file);
      setImg(imageUrl);
      
      // Update the form value
      setValue("receipt_img", file);
    }
  };

  const handleRemoveImage = () => {
    if (img) {
      URL.revokeObjectURL(img);
      setImg(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setValue("receipt_img", null);
    setFileError('');
  };






  //funciton to handle the selected taxs
  const handleSelectTax = (selectTax) => {
    //remove the tax from the list of available taxs
    setListOfAvailableTaxs(prev=> prev.filter(tax => tax.id !== selectTax.id));

    //add the tax to the selected taxs
    setSelectedTaxs(prev => [...prev, selectTax]);
  };


  //function to handle tax removal
  const handleTaxRemove = (taxToRemove) => {
    // Remove from selected taxes
    setSelectedTaxs(prev => prev.filter(tax => tax.id !== taxToRemove.id));
    
    // Add back to available taxes
    //setListOfAvailableTaxs(prev => [...prev, taxToRemove]);

    // Unregister the tax field from the form
    unregister(taxToRemove.id)

    console.log('tax to remove', taxToRemove);
    



    // Only add back if it belongs to the current customer
    if (customerSelectedData) {
      const customerTaxIds = customerSelectedData.customertaxtracking_set.map(tax => tax.tax);
      if (customerTaxIds.includes(taxToRemove.id)) {
        setListOfAvailableTaxs(prev => [...prev, taxToRemove]);
      }
    } else {
      // If no customer selected, add back to available list
      setListOfAvailableTaxs(prev => [...prev, taxToRemove]);
    }
    
  };






    //function to handle the print receipt
    const handlePrintReceipt = async () => {



      // work only we get the customer data
      if (!customerSelectedData) {
        setModalIcon(<ReportProblemOutlinedIcon fontSize='large'/>)
        setModalColor('danger')
        setModalTitle('Veuillez sélectionner un client.')
        setShowModal(true)
        return;
      }

      setPdfLoading(true); // Set loading state to true
      try {
        //get teh current form data
        const formValues = getValues();

        //collect all relevant data

        const receiptData = {

          //customer info
          customer: {
            customer_id: formValues.user_id,
            first_name: customerSelectedData.customer_firstname,
            last_name: customerSelectedData.customer_lastname,
            belongs_to: customerSelectedData.customer_belong_to,
          },

          //payement details
          payment: {
            method : formValues.pay_method,
            date: new Date().toISOString()
          },

          actions: formValues.actions,

          taxes: selectedTaxs.map(tax => ({
            tax_id: tax.id,
            name: tax.tax_name,
            amount: Number(formValues[tax.id] || 0)
          }))
        }

        console.log('data for receipt printing:', receiptData);
        

        //call the API for generating the receipt
        //const response = await generateReceiptPDF(receiptData);

        await generateReceiptPDF(receiptData);


        
      } catch (error) {
        console.error("Error generating receipt PDF:", error);
        setModalIcon(<ReportProblemOutlinedIcon fontSize='large'/>);
        setModalColor('danger');
        setModalTitle('Erreur lors de la génération du reçu PDF');
        setShowModal(true);
      }finally {
        setPdfLoading(false); // Reset loading state
      }

    }


  return (
    <>
    <SideNavbar />
    <main className="flex min-h-screen bg-[#fafafa] mb-20">

      <Box
        sx={{
          marginLeft: isMobile ? 0 : '15vw',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 2, sm: 4 },
          bgcolor: 'background.default',
          mb: '200px'
        }}
      >




        <Modal
          open={openRegisterModal}
          onClose={() => setOpenRegisterModal(false)}
          wid          
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}
        >
          <ModalDialog sx={{
            width: isMobile ? '95vw' : 'auto',
          }}
          > 
            <ModalClose/>
              <DashboardNewCustomer onSuccess={() => setOpenRegisterModal(false)} />
          </ModalDialog>
        </Modal>



        {isMobile ? (<></>) : (<UserLogged/>)}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '400px', md: '500px' },
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            p: 3,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            //overflowY:'auto',
            maxHeight: 'auto'
          }}
        >



          {/* top section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            mb: 2
          }}>
            <PointOfSaleOutlinedIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />
            <Typography 
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem' }, 
                fontWeight: 'bold', 
                color: 'text.primary' 
              }}
            >
              PAYER
            </Typography>
          </Box>



          {/* typed the user id */}
          {/* 
          <Controller
            name="user_id"
            control={control}
            rules={{ 
              required: "L'ID utilisateur est requis",
              min: { value: 1, message: " L'ID utilisateur doit être positif" }
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                label="ID utilisateur"
                placeholder="Entrez l'ID utilisateur"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          */}

          {/* select the client who will pay */}

          <InputClientIdPay
            control={control}
            reset={reset}
            setSelectedTaxs={setSelectedTaxs}
            setImg={setImg}
            setFileError={setFileError}
            setCustomerName={setCustomerName}
            setCustomerSelectedData={setCustomerSelectedData}
            setAmmountLeft={setAmmountLeft}
            setFormData={setFormData}
            setCustomerInfoData={setCustomerInfoData}
            customerName={customerName}
          
          />


          {/* Button to register new customer */}
          <Button
            startIcon={<AddCircleOutlineIcon/>}
            variant='contained'
            sx={{
              mt: '0.5rem',
              textTransform: 'none',
              bgcolor: '#546e7a',
              '&:hover': {
                bgcolor: '#455a64'
              }
            }}
            // color='#455a64'
            onClick={() => setOpenRegisterModal(true)}
          >
            Enregistrer un nouveau client
          </Button>



          {/* show the  data of customer we selected */}
          {customerSelectedData && isMobile && (
          

            <ShowCustomerSelectedData
              customerSelectedData={customerSelectedData}
              isMobile={isMobile}
            />
          )} 
      

          {/* Actions */}

          <InputCustomerActionPay
            control={control}
            customerSelectedData={customerSelectedData}
          />














          {/* the new field based on the selected tax */}
          
          {selectedTaxs.map((tax) => {
            return (
              <TaxAddingForm
                key={tax.id}
                nameOfTax={tax.tax_name}
                fieldName={`${tax.id}`}
                control={control}
                onRemove={
                  //remove the tax from the form
                  () => handleTaxRemove(tax)
                  //remove the tax value from the form
                  
                
                }
              />
            )
          })}
        

          {/* select to add new taxs fields */}

          {customerSelectedData && listOfAvailableTaxs.length > 0 && (

            <PlusButtonForAddingTax 
              availableTaxs={listOfAvailableTaxs} 
              onTaxSelect={handleSelectTax}
            />
          )}


          {/* select the mode of payment  */}

          <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
            Mode de paiement
          </Typography>
          <Controller
            name="pay_method"
            control={control}
            rules={{ required: "Le mode de paiement est requis" }}
            render={({ field, fieldState }) => (
              <>
                <Select
                  value={field.value}
                  onChange={(_, newValue) => field.onChange(newValue)}
                  placeholder="Select payment method"
                  sx={{ 
                    height: '56px',
                    bgcolor: 'white',
                    '& .MuiSelect-select': {
                      //paddingY:'2rem'
                    },
                    //paddingY:'1rem',
                    borderColor: fieldState.error ? '#E6212A' : '',
                    color: fieldState.error ? '#cc0000' : '',
                    //height: '10rem'
                  }}
                  slotProps={{
                    listbox: {
                      sx: {
                        '--ListItem-padding': '12px'
                      }
                    }
                  }}
                >
                  <Option value="Cash">Espèces</Option>
                  <Option value="CCP">CCP</Option>
                  <Option value="Banque">Banque</Option>
                </Select>
                {fieldState.error && (
                  <Typography sx={{ color:'#d32f2f',fontSize: '0.75rem', ml: 1.5 }}>
                    {fieldState.error.message}
                  </Typography>
                )}
              </>
            )}
          />


          {/* Print Receipt Button */}
          <Button
            variant="contained"
            fullWidth
            startIcon={<PrintIcon />}
            sx={{
              mt: 1,
              mb: 0,
              textTransform: 'none',
              bgcolor: '#546e7a',
            }}
            onClick={() => {

              // collect data to print
              handlePrintReceipt();
            }}
          >
            Imprimer le reçu
          </Button>



          {/* the receipt img */}
          <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
            Reçu
          </Typography>
          <Controller
            name="receipt_img"
            control={control}
            rules={{ 
              required: !img ? "L'image du reçu est requise" : false,
              validate: {
                validType: (file) => 
                  !file || ['image/jpeg', 'image/png'].includes(file.type) || "Seules les fichiers JPEG et PNG sont"
              }
            }}
            render={({ field, fieldState }) => (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="receipt-img"
                  accept="image/png,image/jpeg"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    handleImageUpload(e);
                    field.onChange(e.target.files[0] || null);
                  }}
                />

                <label htmlFor="receipt-img">
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 6,
                      bgcolor:'#546e7a',
                      color: 'white',
                      fontWeight: 'medium',
                      textAlign: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      width: '100%',
                      justifyContent: 'center',
                      '&:hover': {
                        bgcolor: '#595959',
                      },
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <PhotoSizeSelectActualOutlinedIcon fontSize="small" />
                    {img ? "Changer l'image du reçu" : "Télécharger l'image du reçu"}
                  </Box>
                </label>

                {(fieldState.error || fileError) && (
                  <Typography sx={{ color:'#d32f2f', fontSize: '0.75rem', paddingLeft:'1rem' }}>
                    {fileError || fieldState.error?.message}
                  </Typography>
                )}

                {img && (
                  <Box sx={{ position: 'relative', mt: 1 }}>
                    <Box
                      component="img"
                      src={img}
                      alt="Receipt preview"
                      sx={{
                        width: '100%',
                        maxHeight: 200,
                        objectFit: 'contain',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    />
                    <IconButton
                      onClick={handleRemoveImage}
                      sx={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        bgcolor: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                        }
                      }}
                      size="small"
                      aria-label="remove image"
                    >
                      <DeleteOutlineIcon sx={{ color: '#E6212A' }} />
                    </IconButton>
                  </Box>
                )}
              </Box>
            )}
          />

          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            sx={{ 
              mt: 6,
              textTransform: 'none',
              fontWeight: 'bold',
              bgcolor: '#E6212A',
              '&:hover': {
                bgcolor: '#c31420'
              }
            }}
          >
            Payer
          </Button>
        </Box>


        {/* show the  data of customer we selected */}
        {customerSelectedData && !isMobile && (
        
            <ShowCustomerSelectedData
              customerSelectedData={customerSelectedData}
              isMobile={isMobile}
            />

        )} 
    
      </Box>
      


      {/* modal */}

      <ModalCard 
        showModal={showModal} 
        color={modalColor}
        title={modalTitle} 
        setShowModal={setShowModal}
        icon={modalIcon} 
        >
          {customerInfoData && (
    <Box 
    className="flex flex-col gap-4" 
      sx={{ 
        width: isMobile ? 'auto' : 'fit-content',
        
        maxHeight: { xs: '65vh', md: '70vh' },
        overflowY: 'auto',
        px: { xs: 0, sm: 1.5 },
        py: 1,
        '&::-webkit-scrollbar': {
          width: '8px',
          background: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '4px'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent'
        }
      }}
    >
      {/* Header Summary */}
      <Box sx={{
        backgroundColor: 'background.surface',
        borderRadius: '12px',
        p: 3,
        //overflowY:'scroll',
        height: '18rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        //overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: 'primary.main',
        }
      }}>
        <Typography level="h4" sx={{ mb: 1, fontWeight: 'bold', color: 'text.primary' }}>
          Confirmation de Paiement
        </Typography>
        <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 2 }}>
          Client #{parseInt(getValues('user_id'))} - {customerInfoData.customer.customer_firstname} {customerInfoData.customer.customer_lastname}
        </Typography>
        
        <Box sx={{ 
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: { xs: 2, sm: 6 },
          mt: 1
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>MONTANT À PAYER</Typography>


              {/* calcualte the totla of the customer pays */}

              {(() => {
                // Get all relevant amounts (service + dynamic taxes)
                let total = Object.entries(formData)
                  .filter(([key]) =>
                    !['pay_method', 'receipt_img', 'user_id'].includes(key)
                  )
                  .reduce((sum, [, value]) => sum + (Number(value) || 0), 0);

                // Add values from actions array
                if (formData.actions && Array.isArray(formData.actions)) {
                  formData.actions.forEach(action => {
                    total += Number(action.value) || 0;
                  });
                }

                  
                return (
                  <>
                    <Typography level="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {total.toLocaleString('fr-DZ')} DA
                    </Typography>
                  </>
                );
              })()}



            
          </Box>
          <Divider orientation="vertical" />
          <Box sx={{ textAlign: 'center' }}>
            <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>MÉTHODE</Typography>
            <Typography level="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {getValues('pay_method')}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Main Content */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 4,
        backgroundColor: 'background.surface',
        borderRadius: '12px',
        //overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        overflowY:isMobile ? 'unset' : 'auto',
        width:'max-content',
      }}>

        
        {/* Customer Information Section */}
        <Box sx={{ 
          flex: 1, 
          p: isMobile ? 0 : 3,
          backgroundColor: '#fcfcfc',
          overflowY:'auto',
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'start', 
            mb: 2.5,
            gap: 1
          }}>
            <Typography level={isMobile ? "title-bg": "title-md"} sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'start' }}>
              Informations du Client
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'auto 1fr', 
            gap: '10px 16px', 
            alignItems: 'baseline',
            pl: 2 
          }}>
            <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>ID:</Typography>
            <Typography sx={{ fontWeight: 'bold' }}>{parseInt(getValues('user_id'))}</Typography>
            
            <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Prénom:</Typography>
            <Typography>{customerInfoData.customer.customer_firstname}</Typography>
            
            <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Nom:</Typography>
            <Typography>{customerInfoData.customer.customer_lastname}</Typography>
            
            <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Mobile:</Typography>
            <Typography>{customerInfoData.customer.customer_mobile}</Typography>
            
            <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Wilaya:</Typography>
            <Typography>{customerInfoData.customer.customer_wilaya}</Typography>
            
            <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Daira:</Typography>
            <Typography>{customerInfoData.customer.customer_daira}</Typography>
            
            <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Commune:</Typography>
            <Typography>{customerInfoData.customer.customer_commune}</Typography>
            
            <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Adresse:</Typography>
            <Typography>{customerInfoData.customer.customer_address}</Typography>
          </Box>
        </Box>
        
        {/* Payment Details Section */}
        <Box sx={{ 
          flex: 1.2, 
          p: isMobile ? 0 : 3,
          paddingTop: isMobile ? 2 : 0,
          borderLeft: {  md: '1px solid' },
          borderTop: { xs: 'none', md: 'none' },
          borderColor: 'divider',
          backgroundColor: 'white',
          height:'100%',

          
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'start', 
            mb: 2.5,
            gap: 1
          }}>
            <Typography level={`${isMobile ? "title-bg": "title-md"}`} sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Détails du Paiement
            </Typography>
          </Box>





          {/* show the current user balance and the transaction what he payed */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              width: 'max-content',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'start' : 'start',
              
            }}
          >

            {/* Current Balance Section */}
            <Box sx={{ 
              mb: 3,
              width:'100%'
            }}>
              <Box sx={{borderBottom: '1px solid', marginBottom:1}}>
                <Typography level="body-md" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 1.5 }}>
                  Solde actuel
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'auto 1fr', 
                gap: '8px 24px',
                alignItems: 'center',
                alignSelf: 'start',
                pl: 1
              }}>


                {/* total */}


                  {/* calcualte the totla of the customer pays */}

                  {(() => {
                    // Get all relevant amounts (service + dynamic taxes)
                    //const total = customerSelectedData.customertaxtracking_set.reduce((sum,tax) => sum + (Number(tax.amount) || 0), 0);
                    const total = customerSelectedData.customertaxtracking_set.reduce((acc, item) => acc + Number(item.amount), 0) + Number(customerSelectedData.customer_frais_service) + Number(customerSelectedData.customer_apport_personnel) + Number(customerSelectedData.customer_frais_cash) + Number(customerSelectedData.customer_frais_ramassage) + Number(customerSelectedData.customer_frais_virement);

                    return (
                      <>
                        <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Total:</Typography>
                        <Typography >
                          {total.toLocaleString('fr-DZ')} DA
                        </Typography>
                      </>
                    );
                  })()}


                
                {/* cash */}
                { Number(customerInfoData.customer.customer_frais_cash) > 0  && (
                  <>
                    <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Cash:</Typography>
                    <Typography>{Number(customerInfoData.customer.customer_frais_cash).toLocaleString('fr-DZ')} DA</Typography>
                  </>
                )}
                  
                
                {/* ramassage */}
                { Number(customerInfoData.customer.customer_frais_ramassage) > 0  && (
                  <>
                    <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Ramassage:</Typography>
                    <Typography>{Number(customerInfoData.customer.customer_frais_ramassage).toLocaleString('fr-DZ')} DA</Typography>
                  </>
                )}
                

                {/* virement */}
                { Number(customerInfoData.customer.customer_frais_virement) > 0  && (
                  <>
                    <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Virement:</Typography>
                    <Typography>{Number(customerInfoData.customer.customer_frais_virement).toLocaleString('fr-DZ')} DA</Typography>
                  </>
                )}


                {/* service */}
                { Number(customerInfoData.customer.customer_frais_service) > 0  && (
                  <>
                    <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Service:</Typography>
                    <Typography>{Number(customerInfoData.customer.customer_frais_service).toLocaleString('fr-DZ')} DA</Typography>
                  </>
                )}
                
                {/* apport personnel */}
                {Number(customerInfoData.customer.customer_apport_personnel) > 0 && (
                  <>
                    <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Apport personnel:</Typography>
                    <Typography>{Number(customerInfoData.customer.customer_apport_personnel).toLocaleString('fr-DZ')} DA</Typography>
                  </>
                )}
                



                {/* rest of taxes */}

                {
                  customerSelectedData.customertaxtracking_set.map((tax) => {
                    return (
                      <React.Fragment key={tax.tax}>

                        <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>{tax.tax_name }:</Typography>
                        <Typography>{`${Number(tax.amount) } DA`}</Typography>
                      </React.Fragment>
                    )
                  })
                }

              </Box>
            </Box>
            
            {/* Transaction Details */}
            <Box sx={{ 
              width: '100%',
              mb: 2
            }}>
              <Box sx={{borderBottom: '1px solid', marginBottom:1}}>
                <Typography level="body-md" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 1.5 }}>
                  Détails de la transaction
                </Typography>
              </Box>
              
              {formData && (
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'auto 1fr', 
                  gap: '8px 24px',
                  alignItems: 'center',
                  alignSelf: 'start',
                  pl: 1
                }}>
                  
                  <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Méthode:</Typography>
                  <Typography>{getValues('pay_method')}</Typography>
                  

                  {/* calcualte the totla of the customer pays */}

                  {(() => {
                    // Get all relevant amounts (service + dynamic taxes)
                    let total = Object.entries(formData)
                      .filter(([key]) =>
                        !['pay_method', 'receipt_img', 'user_id', 'actions'].includes(key)
                      )
                      .reduce((sum, [, value]) => sum + (Number(value) || 0), 0);

                    // Add values from actions array
                    if (formData.actions && Array.isArray(formData.actions)) {
                      formData.actions.forEach(action => {
                        total += Number(action.value) || 0;
                      });
                    }


                    return (
                      <>
                        <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Total:</Typography>
                        <Typography >
                          {total.toLocaleString('fr-DZ')} DA
                        </Typography>
                      </>
                    );
                  })()}




                  {/* service payed */}
                  {formData.actions.find(value => value.type === 'fraisService')?.value > 0 && (
                    <>
                      <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Service:</Typography>
                      <Typography>{Number(formData.actions.find(value => value.type === 'fraisService').value ).toLocaleString('fr-DZ')} DA</Typography>
                    </>
                  )}
                    

                  
                  {/* apport personnel payed */}
                  {formData.actions.find(value => value.type === 'apportPersonnel')?.value > 0 && (
                    <>
                      <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Apport personnel:</Typography>
                      <Typography>{Number(formData.actions.find(value => value.type === 'apportPersonnel').value).toLocaleString('fr-DZ')} DA</Typography>
                    </>
                  )}


                    

                  {/* ramassage payed */}
                  {formData.actions.find(value => value.type === 'fraisRamassage')?.value > 0 && (
                    <>
                      <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Ramassage:</Typography>
                      <Typography>{Number(formData.actions.find(value => value.type === 'fraisRamassage').value).toLocaleString('fr-DZ')} DA</Typography>
                    </>
                  )}


                  {/* cash payed */}
                  {formData.actions.find(value => value.type === 'fraisCash')?.value > 0 && (
                    <>
                      <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Cash:</Typography>
                      <Typography>{Number(formData.actions.find(value => value.type === 'fraisCash').value).toLocaleString('fr-DZ')} DA</Typography>
                    </>
                  )}
                    

                  {/* virement payed */}
                  {formData.actions.find(value => value.type === 'fraisVirement')?.value > 0 && (
                    <>
                      <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Virement:</Typography>
                      <Typography>{Number(formData.actions.find(value => value.type === 'fraisVirement').value).toLocaleString('fr-DZ')} DA</Typography>
                    </>
                  )}






                  {/* display the dynamic taxes */}


                  {Object.entries(formData)
                    .filter(([key, value]) => 
                      !['pay_method', 'receipt_img', 'user_id', 'actions'].includes(key)
                    )
                    .map(([key, value]) => {
                      
                      
                      //get the tax infos from the all taxs list to get the tax name to display it in the summoray
                      const taxObj = allTaxsList.find(tax => tax.id === Number(key))
                      //get the tax name
                      const taxName = taxObj ? taxObj.tax_name : key 
                      
                      
                      //Extract tax ID form the key (e.g '8' -> tax_name)
                      return (
                        <React.Fragment key={key}>
                          <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>{taxName}:</Typography>
                  
                          <Typography sx={{ color: 'success.main' }}>
                            {(Number(value) ).toLocaleString('fr-DZ')} DA
                          </Typography>
                        </React.Fragment>
                      )
                    } )
                  }



                  {/*                   
                  <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Total:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{(Number(formData.amount_paid_service) ).toLocaleString('fr-DZ')} DA</Typography> */}


                </Box>
              )}
            </Box>
            
          </Box>
          
          
          
          
          {/* Result */}
          <Box sx={{ 
            p: isMobile ? 1 : 3,
            backgroundColor: (ammountLeft < 0 || hasNegativeAfterDeduction(customerInfoData, formData, selectedTaxs)) ? 'error.softBg' : 'success.softBg',
            borderRadius: 2,
            marginTop: 2,
            border: '1px solid',
            borderColor: (ammountLeft < 0 || hasNegativeAfterDeduction(customerInfoData, formData, selectedTaxs)) ? 'error.outlinedBorder' : 'success.outlinedBorder',
            width:'max-content',
            justifySelf:'center'
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              
            }}>
              <Typography level="body-md" sx={{ fontWeight: 'bold' }}>
                Montant Restant:
              </Typography>
              <Typography level="body-lg" sx={{ 
                fontWeight: 'bold', 
                color: (ammountLeft < 0 || hasNegativeAfterDeduction(customerInfoData, formData, selectedTaxs)) ? 'error.main' : 'success.main' ,
                paddingLeft:'1rem'
              }}>
                {Number(ammountLeft).toLocaleString('fr-DZ')} DA
              </Typography>
            </Box>



            
            { (hasNegativeAfterDeduction(customerInfoData, formData, selectedTaxs) || ammountLeft < 0) && (
              <Box sx={{ 
                mt: 1.5,
                p: 1.5,
                borderRadius: 1,
                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <ReportProblemOutlinedIcon fontSize="small" color="error" />
                <Typography sx={{ fontWeight: 'medium', color: 'error.main', fontSize: '0.875rem' }}>
                  Le montant restant est négatif, c'est incorrect
                </Typography>
              </Box>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection:'column',
              justifyContent: 'space-between',
              alignItems: 'align-baseline',
            }}>

              {/* new apport personnel */}
              {Number(formData.actions.find(value => value.type === 'apportPersonnel')?.value) > 0 && (
                <Box className='flex justify-between '>
                  <Typography level="body-md" >
                    Nouvel Apport Personnel:
                  </Typography>
                  <Typography level="body-lg" sx={{  color: 'text.primary', paddingLeft:'1rem' }}>
                    {(Number(customerInfoData.customer.customer_apport_personnel) - Number(formData.actions.find(action => action.type === 'apportPersonnel')?.value || 0)).toLocaleString('fr-DZ', { maximumFractionDigits: 2 })} DA
                  </Typography>

                </Box>
              )}




              {/* new ramassage */}
              {Number(formData.actions.find(value => value.type === 'fraisRamassage')?.value) > 0 && (
                <Box className='flex justify-between '>
                  <Typography level="body-md" >
                    Nouvel Frais de Ramassage:
                  </Typography>
                  <Typography level="body-lg" sx={{  color: 'text.primary', paddingLeft:'1rem' }}>
                    {(Number(customerInfoData.customer.customer_frais_ramassage) - Number(formData.actions.find(action => action.type === 'fraisRamassage')?.value || 0)).toLocaleString('fr-DZ', { maximumFractionDigits: 2 })} DA
                  </Typography>

                </Box>
              )}




              {/* new Virment */}
              {Number(formData.actions.find(value => value.type === 'fraisVirement')?.value) > 0 && (
                <Box className='flex justify-between '>
                  <Typography level="body-md" >
                    Nouvel frais de virement:
                  </Typography>
                  <Typography level="body-lg" sx={{  color: 'text.primary', paddingLeft:'1rem' }}>
                    {(Number(customerInfoData.customer.customer_frais_virement) - Number(formData.actions.find(action => action.type === 'fraisVirement')?.value || 0)).toLocaleString('fr-DZ', { maximumFractionDigits: 2 })} DA
                  </Typography>

                </Box>
              )}




              {/* new frais de cash */}
              {Number(formData.actions.find(value => value.type === 'fraisCash')?.value) > 0 && (
                <Box className='flex justify-between '>
                  <Typography level="body-md" >
                    Nouvel frais de cash:
                  </Typography>
                  <Typography level="body-lg" sx={{  color: 'text.primary', paddingLeft:'1rem' }}>
                    {(Number(customerInfoData.customer.customer_frais_cash) - Number(formData.actions.find(action => action.type === 'fraisCash')?.value || 0)).toLocaleString('fr-DZ', { maximumFractionDigits: 2 })} DA
                  </Typography>

                </Box>
              )}


              
              {/* new frais de service */}

              { Number(formData.actions.find(value => value.type === 'fraisService')?.value) > 0 && (

                <Box className='flex justify-between'>

                  <Typography level="body-md">
                    Nouvel Frais de Service:
                  </Typography>
                  <Typography level="body-lg" sx={{color: 'text.primary', paddingLeft:'1rem' }}>
                    {(Number(customerInfoData.customer.customer_frais_service) - Number(formData.actions.find(action => action.type === 'fraisService')?.value || 0)).toLocaleString('fr-DZ', { maximumFractionDigits: 2 })} DA
                  </Typography>

                </Box>
              )}


              <Box className='flex flex-col gap-1'>
                {selectedTaxs.map((tax) => {
                  // Find the original tax amount from customerInfoData
                  const originalTax = customerInfoData.customertaxtracking_set.find(
                    t => t.tax === tax.id
                  );
                  const originalAmount = Number(originalTax?.amount || 0);
                  const paidAmount = Number(formData[tax.id] || 0);
                  const newAmount = originalAmount - paidAmount;

                  return (
                    <Box key={tax.id} className='flex justify-between'>
                      <Typography level="body-md">{tax.tax_name}:</Typography>
                      <Typography
                        level="body-lg"
                        sx={{
                          color: newAmount < 0 ? 'error.main' : 'text.primary',
                          paddingLeft: '1rem'
                        }}
                      >
                        {newAmount.toLocaleString('fr-DZ', { maximumFractionDigits: 2 })} DA
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
              


            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Action Button */}
      <Button
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoadingConfirmPay || (ammountLeft < 0 || hasNegativeAfterDeduction(customerInfoData, formData, selectedTaxs))}
        
        
        loading={isLoadingConfirmPay}
        sx={{ 
          mt: 4,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 'bold',
          borderRadius: 2,
          textTransform: 'none',
          bgcolor: (ammountLeft < 0 || hasNegativeAfterDeduction(customerInfoData, formData, selectedTaxs)) ? 'grey.400' : '#E6212A',
          '&:hover': {
            bgcolor: (ammountLeft < 0 || hasNegativeAfterDeduction(customerInfoData, formData, selectedTaxs)) ? 'grey.500' : '#c31420'
          }
        }}
        onClick={async () => {
          console.log('Button clicked');
          //await postCustomerPay(formData, setModalIcon, setModalColor, setModalTitle, setShowModal, setCustomerInfoData);
          
          setIsLoadingConfirmPay(true);
          const res = await postCustomerPay(formData, setModalIcon, setModalColor, setModalTitle, setShowModal, setCustomerInfoData);
          if (res) {
            reset(); // <-- This will clear the form fields
            setImg(null); // Clear the image preview
            setFileError('');
            setCustomerName('');
            setCustomerSelectedData(null);
            setAmmountLeft(null);
            setFormData(null);
            setCustomerInfoData(null); // Clear the customer info data
            setCustomerSelectedData(null)

            //update the customer data in the Informations client the 'customerSelectedData'
            //i commented this part because it was not working properly and i do not need it right now
            // when the user successfully payed the form data is cleared
            setCustomerSelectedData( prev => {
              // if (!prev) return prev;

              //clone the previous data
              // const updatedData = {...prev};

              //minus service and apport personnel
              // updatedData.customer_frais_service = Number(prev.customer.customer_frais_service) - Number(formData.amount_paid_service || 0);
              // updatedData.customer_apport_personnel = Number(prev.customer.customer_apport_personnel) - Number(formData.amount_paid_apport_personnel || 0);

              //Update each tax in customertaxtracking_set
              // updatedData.customertaxtracking_set = prev.customertaxtracking_set.map(tax => {
                
              //   //get the list of the dynamic taxes tha customer paid
              //   const dynamicTaxesPaid = Object.entries(formData)
              //   .filter(([key]) =>
              //     !['pay_method', 'user_id', 'amount_paid_service', 'amount_paid_apport_personnel', 'receipt_img'].includes(key)
              //   )
              //   .map(([taxId, amount]) => ({
              //     taxId,
              //     amountPaid: Number(amount)
              //   })
                
              //   )

              //   //deduct only the paid taxes form customertaxetracking_set
              //   updatedData.customertaxtracking_set = prev.customertaxtracking_set.map(tax => {
              //     const paidTax = dynamicTaxesPaid.find(t => t.taxId === tax.tax)
              //     const paid = paidTax ? paidTax.amountPaid : 0;

              //     return {
              //       ...tax,
              //       amount: Number(tax.amount) - paid
              //     }
              //   })
                
              // })

              // return updatedData


            })


          }
          setIsLoadingConfirmPay(false);
        }}
      >
        Confirmer le Paiement
      </Button>
    </Box>
  )}

      </ModalCard>



      {/* to indicate loading state when printin the PDF for the recu */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={pdfLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

    </main>
  </>
  );
}























    // <Box 
    // className="flex flex-col gap-4" 
    //   sx={{ 
    //     width: 'fit-content',
        
    //     maxHeight: { xs: '65vh', md: '70vh' },
    //     overflowY: 'auto',
    //     px: { xs: 1, sm: 1.5 },
    //     py: 1,
    //     '&::-webkit-scrollbar': {
    //       width: '8px',
    //       background: 'transparent'
    //     },
    //     '&::-webkit-scrollbar-thumb': {
    //       backgroundColor: 'rgba(0,0,0,0.2)',
    //       borderRadius: '4px'
    //     },
    //     '&::-webkit-scrollbar-track': {
    //       backgroundColor: 'transparent'
    //     }
    //   }}
    // >
    //   {/* Header Summary */}
    //   <Box sx={{
    //     backgroundColor: 'background.surface',
    //     borderRadius: '12px',
    //     p: 3,
    //     //overflowY:'scroll',
    //     height: '18rem',
    //     display: 'flex',
    //     flexDirection: 'column',
    //     alignItems: 'center',
    //     position: 'relative',
    //     //overflow: 'hidden',
    //     boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    //     '&::before': {
    //       content: '""',
    //       position: 'absolute',
    //       top: 0,
    //       left: 0,
    //       right: 0,
    //       height: '4px',
    //       backgroundColor: 'primary.main',
    //     }
    //   }}>
    //     <Typography level="h4" sx={{ mb: 1, fontWeight: 'bold', color: 'text.primary' }}>
    //       Confirmation de Paiement
    //     </Typography>
    //     <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 2 }}>
    //       Client #{parseInt(getValues('user_id'))} - {customerInfoData.customer.customer_firstname} {customerInfoData.customer.customer_lastname}
    //     </Typography>
        
    //     <Box sx={{ 
    //       width: '100%',
    //       display: 'flex',
    //       justifyContent: 'center',
    //       gap: { xs: 2, sm: 6 },
    //       mt: 1
    //     }}>
    //       <Box sx={{ textAlign: 'center' }}>
    //         <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>MONTANT À PAYER</Typography>


    //           {/* calcualte the totla of the customer pays */}

    //           {(() => {
    //             // Get all relevant amounts (service + dynamic taxes)
    //             const total = Object.entries(formData)
    //               .filter(([key]) =>
    //                 !['pay_method', 'receipt_img', 'user_id'].includes(key)
    //               )
    //               .reduce((sum, [, value]) => sum + (Number(value) || 0), 0);

    //             return (
    //               <>
    //                 <Typography level="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
    //                   {total.toLocaleString('fr-DZ')} DA
    //                 </Typography>
    //               </>
    //             );
    //           })()}



            
    //       </Box>
    //       <Divider orientation="vertical" />
    //       <Box sx={{ textAlign: 'center' }}>
    //         <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>MÉTHODE</Typography>
    //         <Typography level="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
    //           {getValues('pay_method')}
    //         </Typography>
    //       </Box>
    //     </Box>
    //   </Box>
      
    //   {/* Main Content */}
    //   <Box sx={{
    //     display: 'flex',
    //     flexDirection: { xs: 'column', md: 'row' },
    //     gap: 4,
    //     backgroundColor: 'background.surface',
    //     borderRadius: '12px',
    //     //overflow: 'hidden',
    //     boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    //     overflowY:'scroll',
    //     width:'max-content',
    //   }}>
    //     {/* Customer Information Section */}
    //     <Box sx={{ 
    //       flex: 1, 
    //       p: 3,
    //       backgroundColor: '#fcfcfc',
    //       //overflowY:'scroll',
    //     }}>
    //       <Box sx={{ 
    //         display: 'flex', 
    //         alignItems: 'center', 
    //         mb: 2.5,
    //         gap: 1
    //       }}>
    //         <Box sx={{ 
    //           width: 6, 
    //           height: 24, 
    //           backgroundColor: 'primary.main', 
    //           borderRadius: 1,
    //           mr: 1
    //         }} />
    //         <Typography level="title-md" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
    //           Informations Client
    //         </Typography>
    //       </Box>
          
    //       <Box sx={{ 
    //         display: 'grid', 
    //         gridTemplateColumns: 'auto 1fr', 
    //         gap: '10px 16px', 
    //         alignItems: 'baseline',
    //         pl: 2 
    //       }}>
    //         <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>ID:</Typography>
    //         <Typography sx={{ fontWeight: 'bold' }}>{parseInt(getValues('user_id'))}</Typography>
            
    //         <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Prénom:</Typography>
    //         <Typography>{customerInfoData.customer.customer_firstname}</Typography>
            
    //         <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Nom:</Typography>
    //         <Typography>{customerInfoData.customer.customer_lastname}</Typography>
            
    //         <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Mobile:</Typography>
    //         <Typography>{customerInfoData.customer.customer_mobile}</Typography>
            
    //         <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Wilaya:</Typography>
    //         <Typography>{customerInfoData.customer.customer_wilaya}</Typography>
            
    //         <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Daira:</Typography>
    //         <Typography>{customerInfoData.customer.customer_daira}</Typography>
            
    //         <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Commune:</Typography>
    //         <Typography>{customerInfoData.customer.customer_commune}</Typography>
            
    //         <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Adresse:</Typography>
    //         <Typography>{customerInfoData.customer.customer_address}</Typography>
    //       </Box>
    //     </Box>
        
    //     {/* Payment Details Section */}
    //     <Box sx={{ 
    //       flex: 1.2, 
    //       p: 3,
    //       borderLeft: {  md: '1px solid' },
    //       borderTop: { xs: '1px solid', md: 'none' },
    //       borderColor: 'divider',
    //       backgroundColor: 'white',
    //       height:'100%'
    //     }}>
    //       <Box sx={{ 
    //         display: 'flex', 
    //         alignItems: 'center', 
    //         mb: 2.5,
    //         gap: 1
    //       }}>
    //         <Box sx={{ 
    //           width: 6, 
    //           height: 24, 
    //           backgroundColor: 'warning.main', 
    //           borderRadius: 1,
    //           mr: 1
    //         }} />
    //         <Typography level="title-md" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
    //           Détails du Paiement
    //         </Typography>
    //       </Box>





    //       {/* show the current user balance and the transaction what he payed */}
    //       <Box
    //         sx={{
    //           display: 'flex',
    //           gap: 1,
    //           width: 'max-content',
    //         }}
    //       >

    //         {/* Current Balance Section */}
    //         <Box sx={{ 
    //           backgroundColor: 'background.level1',
    //           borderRadius: 2,
    //           p: 2,
    //           mb: 3,
    //           width:'max'
    //         }}>
    //           <Typography level="body-sm" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 1.5 }}>
    //             SOLDE ACTUEL
    //           </Typography>
              
    //           <Box sx={{ 
    //             display: 'grid', 
    //             gridTemplateColumns: 'auto 1fr', 
    //             gap: '8px 24px',
    //             alignItems: 'center',
    //             pl: 1
    //           }}>


    //             {/* total */}


    //               {/* calcualte the totla of the customer pays */}

    //               {(() => {
    //                 // Get all relevant amounts (service + dynamic taxes)
    //                 //const total = customerSelectedData.customertaxtracking_set.reduce((sum,tax) => sum + (Number(tax.amount) || 0), 0);
    //                 const total = customerSelectedData.customertaxtracking_set.reduce((acc, item) => acc + Number(item.amount), 0) + Number(customerSelectedData.customer_frais_service) + Number(customerSelectedData.customer_apport_personnel)

    //                 return (
    //                   <>
    //                     <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Total:</Typography>
    //                     <Typography >
    //                       {total.toLocaleString('fr-DZ')} DA
    //                     </Typography>
    //                   </>
    //                 );
    //               })()}


    //             {/* service */}
    //             <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Service:</Typography>
    //             <Typography>{Number(customerInfoData.customer.customer_frais_service).toLocaleString('fr-DZ')} DA</Typography>
                
    //             {/* apport personnel */}
    //             <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Apport personnel:</Typography>
    //             <Typography>{Number(customerInfoData.customer.customer_apport_personnel).toLocaleString('fr-DZ')} DA</Typography>
                



    //             {/* rest of taxes */}

    //             {
    //               customerSelectedData.customertaxtracking_set.map((tax) => {
    //                 return (
    //                   <React.Fragment key={tax.tax}>

    //                     <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>{tax.tax_name }:</Typography>
    //                     <Typography>{`${Number(tax.amount) } DA`}</Typography>
    //                   </React.Fragment>
    //                 )
    //               })
    //             }

    //           </Box>
    //         </Box>
            
    //         {/* Transaction Details */}
    //         <Box sx={{ 
    //           backgroundColor: 'background.level1',
    //           borderRadius: 2,
    //           p: 2,
    //           mb: 2
    //         }}>
    //           <Typography level="body-sm" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 1.5 }}>
    //             DÉTAILS DE LA TRANSACTION
    //           </Typography>
              
    //           {formData && (
    //             <Box sx={{ 
    //               display: 'grid', 
    //               gridTemplateColumns: 'auto 1fr', 
    //               gap: '8px 24px',
    //               alignItems: 'center',
    //               pl: 1
    //             }}>
                  
    //               <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Méthode:</Typography>
    //               <Typography>{getValues('pay_method')}</Typography>
                  

    //               {/* calcualte the totla of the customer pays */}

    //               {(() => {
    //                 // Get all relevant amounts (service + dynamic taxes)
    //                 const total = Object.entries(formData)
    //                   .filter(([key]) =>
    //                     !['pay_method', 'receipt_img', 'user_id'].includes(key)
    //                   )
    //                   .reduce((sum, [, value]) => sum + (Number(value) || 0), 0);

    //                 return (
    //                   <>
    //                     <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Total:</Typography>
    //                     <Typography >
    //                       {total.toLocaleString('fr-DZ')} DA
    //                     </Typography>
    //                   </>
    //                 );
    //               })()}




    //               {/* service payed */}
    //               <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Service:</Typography>
    //               <Typography>{Number(formData.amount_paid_service).toLocaleString('fr-DZ')} DA</Typography>
                    
    //              {/* apport personnel payed */}
    //               <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Apport personnel:</Typography>
    //               <Typography>{Number(formData.amount_paid_apport_personnel).toLocaleString('fr-DZ')} DA</Typography>
                    







    //               {/* display the dynamic taxes */}


    //               {Object.entries(formData)
    //                 .filter(([key, value]) => 
    //                   !['pay_method', 'amount_paid_service', 'receipt_img', 'user_id', 'amount_paid_apport_personnel'].includes(key)
    //                 )
    //                 .map(([key, value]) => {
                      
                      
    //                   //get the tax infos from the all taxs list to get the tax name to display it in the summoray
    //                   const taxObj = allTaxsList.find(tax => tax.id === Number(key))
    //                   //get the tax name
    //                   const taxName = taxObj ? taxObj.tax_name : key 
                      
                      
    //                   //Extract tax ID form the key (e.g '8' -> tax_name)
    //                   return (
    //                     <React.Fragment key={key}>
    //                       <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>{taxName}:</Typography>
                  
    //                       <Typography sx={{ color: 'success.main' }}>
    //                         {(Number(value) ).toLocaleString('fr-DZ')} DA
    //                       </Typography>
    //                     </React.Fragment>
    //                   )
    //                 } )
    //               }



    //               {/*                   
    //               <Typography sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Total:</Typography>
    //               <Typography sx={{ fontWeight: 'bold' }}>{(Number(formData.amount_paid_service) ).toLocaleString('fr-DZ')} DA</Typography> */}


    //             </Box>
    //           )}
    //         </Box>
            
    //       </Box>
          
          
          
          
    //       {/* Result */}
    //       <Box sx={{ 
    //         p: 2,
    //         backgroundColor: (ammountLeft < 0 || hasNegativeAfterDeduction(customerInfoData, formData, selectedTaxs)) ? 'error.softBg' : 'success.softBg',
    //         borderRadius: 2,
    //         border: '1px solid',
    //         borderColor: (ammountLeft < 0 || hasNegativeAfterDeduction(customerInfoData, formData, selectedTaxs)) ? 'error.outlinedBorder' : 'success.outlinedBorder',
    //         width:'max-content',
    //       }}>
    //         <Box sx={{ 
    //           display: 'flex', 
    //           justifyContent: 'space-between',
    //           alignItems: 'center',
              
    //         }}>
    //           <Typography level="body-md" sx={{ fontWeight: 'medium' }}>
    //             Montant Restant:
    //           </Typography>
    //           <Typography level="body-lg" sx={{ 
    //             fontWeight: 'bold', 
    //             color: (ammountLeft < 0 || hasNegativeAfterDeduction(customerInfoData, formData, selectedTaxs)) ? 'error.main' : 'success.main' ,
    //             paddingLeft:'1rem'
    //           }}>
    //             {Number(ammountLeft).toLocaleString('fr-DZ')} DA
    //           </Typography>
    //         </Box>



            
    //         { (hasNegativeAfterDeduction(customerInfoData, formData, selectedTaxs) || ammountLeft < 0) && (
    //           <Box sx={{ 
    //             mt: 1.5,
    //             p: 1.5,
    //             borderRadius: 1,
    //             backgroundColor: 'rgba(211, 47, 47, 0.08)',
    //             display: 'flex',
    //             alignItems: 'center',
    //             gap: 1
    //           }}>
    //             <ReportProblemOutlinedIcon fontSize="small" color="error" />
    //             <Typography sx={{ fontWeight: 'medium', color: 'error.main', fontSize: '0.875rem' }}>
    //               Le montant restant est négatif, c'est incorrect
    //             </Typography>
    //           </Box>
    //         )}
            
    //         <Divider sx={{ my: 2 }} />
            
    //         <Box sx={{ 
    //           display: 'flex', 
    //           flexDirection:'column',
    //           justifyContent: 'space-between',
    //           alignItems: 'align-baseline',
    //         }}>
    //           <Box className='flex justify-between '>
    //             <Typography level="body-md" >
    //               Nouvel Apport Personnel:
    //             </Typography>
    //             <Typography level="body-lg" sx={{  color: 'text.primary', paddingLeft:'1rem' }}>
    //               {(Number(customerInfoData.customer.customer_apport_personnel) - Number(formData.amount_paid_apport_personnel)).toLocaleString('fr-DZ', { maximumFractionDigits: 2 })} DA
    //             </Typography>

    //           </Box>
              
              
    //           <Box className='flex justify-between'>

    //             <Typography level="body-md">
    //               Nouvel Frais de Service:
    //             </Typography>
    //             <Typography level="body-lg" sx={{color: 'text.primary', paddingLeft:'1rem' }}>
    //               {(Number(customerInfoData.customer.customer_frais_service) - Number(formData.amount_paid_service).toLocaleString('fr-DZ', { maximumFractionDigits: 2 }))} DA
    //             </Typography>

    //           </Box>


    //           <Box className='flex flex-col gap-1'>
    //             {selectedTaxs.map((tax) => {
    //               // Find the original tax amount from customerInfoData
    //               const originalTax = customerInfoData.customertaxtracking_set.find(
    //                 t => t.tax === tax.id
    //               );
    //               const originalAmount = Number(originalTax?.amount || 0);
    //               const paidAmount = Number(formData[tax.id] || 0);
    //               const newAmount = originalAmount - paidAmount;

    //               return (
    //                 <Box key={tax.id} className='flex justify-between'>
    //                   <Typography level="body-md">{tax.tax_name}:</Typography>
    //                   <Typography
    //                     level="body-lg"
    //                     sx={{
    //                       color: newAmount < 0 ? 'error.main' : 'text.primary',
    //                       paddingLeft: '1rem'
    //                     }}
    //                   >
    //                     {newAmount.toLocaleString('fr-DZ', { maximumFractionDigits: 2 })} DA
    //                   </Typography>
    //                 </Box>
    //               );
    //             })}
    //           </Box>
              


    //         </Box>
    //       </Box>
    //     </Box>
    //   </Box>
      
    //   {/* Action Button */}
    //   <Button
    //     fullWidth
    //     variant="contained"
    //     size="large"
    //     disabled={(ammountLeft < 0 || hasNegativeAfterDeduction(customerInfoData, formData, selectedTaxs))}
    //     sx={{ 
    //       mt: 2,
    //       py: 1.5,
    //       fontSize: '1rem',
    //       fontWeight: 'bold',
    //       borderRadius: 2,
    //       bgcolor: (ammountLeft < 0 || hasNegativeAfterDeduction(customerInfoData, formData, selectedTaxs)) ? 'grey.400' : '#E6212A',
    //       '&:hover': {
    //         bgcolor: (ammountLeft < 0 || hasNegativeAfterDeduction(customerInfoData, formData, selectedTaxs)) ? 'grey.500' : '#c31420'
    //       }
    //     }}
    //     onClick={async () => {
    //       console.log('Button clicked');
    //       //await postCustomerPay(formData, setModalIcon, setModalColor, setModalTitle, setShowModal, setCustomerInfoData);
        
    //       const res = await postCustomerPay(formData, setModalIcon, setModalColor, setModalTitle, setShowModal, setCustomerInfoData);
    //       if (res) {
    //         reset(); // <-- This will clear the form fields
    //         setImg(null); // Clear the image preview
    //         setFileError('');
    //         setCustomerName('');
    //         setCustomerSelectedData(null);
    //         setAmmountLeft(null);
    //         setFormData(null);
    //         setCustomerInfoData(null); // Clear the customer info data
    //         setCustomerSelectedData(null)

    //         //update the customer data in the Informations client the 'customerSelectedData'
    //         //i commented this part because it was not working properly and i do not need it right now
    //         // when the user successfully payed the form data is cleared
    //         setCustomerSelectedData( prev => {
    //           // if (!prev) return prev;

    //           //clone the previous data
    //           // const updatedData = {...prev};

    //           //minus service and apport personnel
    //           // updatedData.customer_frais_service = Number(prev.customer.customer_frais_service) - Number(formData.amount_paid_service || 0);
    //           // updatedData.customer_apport_personnel = Number(prev.customer.customer_apport_personnel) - Number(formData.amount_paid_apport_personnel || 0);

    //           //Update each tax in customertaxtracking_set
    //           // updatedData.customertaxtracking_set = prev.customertaxtracking_set.map(tax => {
                
    //           //   //get the list of the dynamic taxes tha customer paid
    //           //   const dynamicTaxesPaid = Object.entries(formData)
    //           //   .filter(([key]) =>
    //           //     !['pay_method', 'user_id', 'amount_paid_service', 'amount_paid_apport_personnel', 'receipt_img'].includes(key)
    //           //   )
    //           //   .map(([taxId, amount]) => ({
    //           //     taxId,
    //           //     amountPaid: Number(amount)
    //           //   })
                
    //           //   )

    //           //   //deduct only the paid taxes form customertaxetracking_set
    //           //   updatedData.customertaxtracking_set = prev.customertaxtracking_set.map(tax => {
    //           //     const paidTax = dynamicTaxesPaid.find(t => t.taxId === tax.tax)
    //           //     const paid = paidTax ? paidTax.amountPaid : 0;

    //           //     return {
    //           //       ...tax,
    //           //       amount: Number(tax.amount) - paid
    //           //     }
    //           //   })
                
    //           // })

    //           // return updatedData


    //         })


    //       }
        
    //     }}
    //   >
    //     Confirmer le Paiement
    //   </Button>
    // </Box>