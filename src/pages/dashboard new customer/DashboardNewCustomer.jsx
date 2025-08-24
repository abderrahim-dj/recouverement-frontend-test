
import React from 'react';
import { useForm, Controller, set, Form } from 'react-hook-form';
import { Box, Modal, Typography, Divider, List, ListItem } from "@mui/joy";
import { Button, TextField, Select, MenuItem } from "@mui/material";
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import SideNavbar from "../../components/UI/SideNavbar";

import { useState, useEffect } from 'react';

import ModalCard from '../../components/UI/ModalCard';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CircularProgress from '@mui/material/CircularProgress';


//my custom authHook
import useAuth from '../../hooks/useAuth';


//fetch request GET to get the custumer data from the server
import getCustomerInfo from '../../services/getCustomerInfo';

//fetch request POST to create and save the customer data in my database
import saveCustomerInfo from '../../services/saveCustomerInfo';

//function that will format the json format that will send to my django sever and store the customer
import createDataforSaving from '../../utils/createDataforSaving';

//fuction that will handle the click of confiramtion saving in the modal
import handleSaveCustomerData from '../../utils/handleSaveCustomerData';

import UserLogged from '../../components/UI/UserLogged';


import ComboTextInputRegisterCustomer from '../../components/UI/ComboTextInputRegisterCustomer'
import { MonetizationOnTwoTone } from '@mui/icons-material';




//import the plus button for adding new tax that are alredy added by the superuser
import PlusButtonForAddingTax from '../../components/UI/PlusButtonForAddingTax';


//import the function that will fetch the list of taxs
import getAllListOfTaxs from '../../services/getAllListOfTaxs';


//import the function that will fetch the list of services
import getAllListOfServices from '../../services/getAllListOfServices';



//import the fucntion that will fetch the list of available customer belong to
import fetchListOfBelongToOption from '../../services/fethListOfBelongToOption';




// import the tax adding from component
import TaxAddingForm from '../../components/UI/TaxAddingForm';


import useIsMobile from '../../hooks/useIsMobile';



//the new dynamic input
import InputCustomerID from './InputCustomerID';
import InputCustomerTaxes from './InputCustomerTaxes';
import InputCustomerBelongTo from './InputCustomerBelongTo';
import InputCustomerAction from './InputCustomerAction';



export default function CreateNewCustomer() {


  
  //my custom hook to check if the user is authenticated or not
  useAuth();

  const isMobile = useIsMobile();
  
  const [showModal,setShowModal]=useState(false);
  const [modalIcon,setModalIcon]=useState();
  const [modalColor, setModalColor] = useState();
  const [modalTitle, setModalTitle] = useState();

  const [customerInfo, setCustomerInfo] = useState(null);
  const [formDataSaving, setFormDataSaving] = useState();

  
  const [loadingButton, setLoadingButton] = useState(false);
  
  //state to display the selected customer
  const [customerSelectedData, setCustomerSelectedData] = useState(null);



  //state to store the list of taxs
  const [listOfAvailableTaxs, setListOfAvailableTaxs] = useState([]);
  
  
  //state to store the list of services
  const [listOfAvailableServices, setListOfAvailableServices] = useState([]);

  //state to store the list of available blong to 
  const [listOfAvailableBelongTo, setListofAvailableBelongTo] = useState();

  
  //state to store the list of taxs that are selected by the user
  const [selectedTaxs, setSelectedTaxs] = useState([]);





  useEffect(() => {
    //fetch the list of taxs from the server
    const fetchListOfTaxs = async () => {
      try {
        const taxsList = await getAllListOfTaxs();
        setListOfAvailableTaxs(taxsList);

      } catch (error) {
        console.error("Error fetching list of taxs:", error);
        setModalIcon(<ReportOutlinedIcon fontSize='large'/>);
        setModalColor('danger');
        setModalTitle('Error fetching list of taxs');
        setShowModal(true);
        
      }
    }

    
    //fetch the list of services
    const fetchListOfServices = async () => {
      try {
        const servicesList = await getAllListOfServices();
        setListOfAvailableServices(servicesList);

        console.log('list of services:', servicesList);
        

      } catch (error) {
        console.error("Error fetching list of services:", error);
        setModalIcon(<ReportOutlinedIcon fontSize='large'/>);
        setModalColor('danger');
        setModalTitle('Error fetching list of services');
        setShowModal(true);
      }
    }


    //fetch list of belong to list
    const fetchListOfBelongTo = async () => {
      try{
        const belongToList = await fetchListOfBelongToOption();
        setListofAvailableBelongTo(belongToList);
        console.log('list of belong to:', belongToList);

      }catch (error) {
        console.error("Error fetching list of belong to:", error);
        setModalIcon(<ReportOutlinedIcon fontSize='large'/>);
        setModalColor('danger');
        setModalTitle('Error fetching list of belong to');
        setShowModal(true);
      }
    }

    fetchListOfTaxs(); //fetch list of taxs
    fetchListOfServices(); //fetch list of services
    fetchListOfBelongTo(); //fetch list of belong to list
  
  }, [])

  //state to add new frais of services
  //const [fraisServiceFields, setFraisServiceFields] = useState([0]);

  // function to handle add new frais of service
  /* 
  const handleAddFraisService = () => {
    setFraisServiceFields(prev => [...prev, Date.now()]);
    console.log('new count of frais of service:', fraisServiceFields);
  }
   */
  //function to handle delete the frais of service input
  /* 
  const handleDeleteFraisService = (index) => {
    setFraisServiceFields(prev => prev.filter((_, i) => i !== index));

    //clear the value in the form i will see later
    
  }
  */


  const { control, handleSubmit, formState: { errors } , getValues, setValue, reset, unregister, setError} = useForm({
    defaultValues: {
      user_id: '',
      customer_belong_to: '',
      //customer_belong_to_name_autre:'',
      actions: [],
      
    }
  });




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
    setListOfAvailableTaxs(prev => [...prev, taxToRemove]);
    
    // unregister the tax field from the form data
    unregister(taxToRemove.id);
  };



  
  const onSubmit = async (data) => {
    
    //check if the user at least entered one action or one tax
    const hasAction = Array.isArray(data.actions) && data.actions.length > 0;
    const hasTax = selectedTaxs.length > 0;

    console.log('hasAction:', hasAction);
    console.log('hasTax:', hasTax);
    

    if (!hasAction && !hasTax) {
      setCustomerInfo(null); // To avoid showing customer info in the modal
      
      setModalIcon(<ReportOutlinedIcon fontSize='large'/>)
      setModalColor('danger')
      setModalTitle('Veuillez sélectionner au moins une action ou une taxe.');
      setShowModal(true);
      return;
    }


    
    
    
    
    
    try {
      //loading the button
      setLoadingButton(true);

      console.log('selectedTaxs:', selectedTaxs);
      

      console.log('data base:', data)


      //const formData = new FormData();
      // Convert user_id to integer, but keep the other fields as float numbers
      
      //combine fraisServie and typeFraisService into an array of objects
      /*       
      const fraisServiceArray = (data.fraisService || []). map((montent, idx) => ({
        montent: parseFloat(montent),
        type: data.typeFraisService?.[idx]
      }))

      //filter out empty or invalid entries
      .filter(item => item.montent && item.type);
      */


      /* 
      const fraisServicesAmmount = fraisServiceArray
        .filter(item => item.montent)
        .reduce((sum, item) => sum + item.montent,0)
      console.log('form data: ',data);
       */

      const knownFields = [
        'user_id',
        'actions',
        'customer_belong_to',
        //'customer_belong_to_name_autre',
      ]
      
      const formData = {
        customer_id: parseInt(data.user_id),
        
        customer_belong_to: data.customer_belong_to,
        //customer_belong_to_name_autre: data.customer_belong_to_name_autre || '',

        customer_frais_apport_personnel: parseFloat(data.actions.find(action => action.type === 'apportPersonnel')?.value) || 0,
        
        customer_frais_service: data.actions.find(action => action.type === 'fraisService')?.serviceType || '',
        customer_frais_service_amount: parseFloat(data.actions.find(action => action.type === 'fraisService')?.value) || 0,

        customer_frais_virement: parseFloat(data.actions.find(action => action.type === 'fraisVirement')?.value) || 0,

        customer_frais_ramassage: parseFloat(data.actions.find(action => action.type === 'fraisRamassage')?.value) || 0,

        customer_frais_cash: parseFloat(data.actions.find(action => action.type === 'fraisCash')?.value) || 0,
     
        
      

        // adding the dynamic taxes that are added
        taxes_for_payment: Object.entries(data)
          .filter(([key, value]) => !knownFields.includes(key) && value !== '')
          .reduce((acc, [key, value]) => {
            if (key) {
              const taxId = key;
              acc[taxId] = parseFloat(value) || 0;
            }
            return acc;
          }, {}

          )
          // .forEach(([key, value]) => {
          //   data
          // })
          
        //add the dynamic taxes if they are added
      };
      
      console.log('form data:', formData);

      //get the user data
      const customerInfoData = await getCustomerInfo(data.user_id);
     
      setCustomerInfo(customerInfoData);
      
      //stop loading the button
      


      if (customerInfoData) {

        //form the data to send it in the POST request to save the customer infos
        /* 
        const dataForSaving = {
            "customer_id": data.user_id,
            "customer_firstname": customerInfo.data.nom,
            "customer_lastname": customerInfo.data.prenom,
            "customer_mobile": customerInfo.data.mobile,
            "customer_email": customerInfo.data.email,
            "customer_address": customerInfo.data.adresse,
            "customer_wilaya": customerInfo.data.wilaya,
            "customer_commune": customerInfo.data.commune,
            "customer_daira": customerInfo.data.daira,
            "customer_postal_code": customerInfo.data.code_postal,
            
            "customer_apport_personnel_start": Number(data.ramassage) + Number(data.service) + Number(data.livresent),
          
            "customer_ramassage_start": data.ramassage,
            
          
            "customer_service_start": data.service,
            
          
            "customer_livraison_start": data.livresent,
            
            
          
            "products": customerInfo.data.produits.map((product) => (
                {
                  "product_name": product.produit,
                  "product_price": product.prix,
                  "product_quantity": product.quantité,
                  "product_brand": product.marque
                }
              ))
             
          
            }
        */

        const dataForSaving = createDataforSaving(customerInfoData, formData)
            
        //saving the data confirmation modal
        setFormDataSaving(dataForSaving);
        
        console.log("Form data:", formData);
        console.log('form data for saving:', dataForSaving);
        
        setModalIcon(<InfoOutlineIcon fontSize='large'/>)
        setModalColor('white');
        setModalTitle('Confirmer');
        
        setShowModal(true);
        

        //reset the fields
        //reset()
        //setFraisServiceFields([0])
        //setCustomerSelectedData(null);
        //setSelectedTaxs([]);

        
      }else{
        setModalColor('danger');
        setModalTitle('Error the customer cannot be found');
        setModalIcon(<ReportOutlinedIcon fontSize='large'/>)
        setShowModal(true)
      }



      // Add your API call or form submission logic here
    } catch (error) {
      setModalIcon(<ReportOutlinedIcon fontSize='large'/>)
      setModalColor('danger')
      setModalTitle('Error');
      setShowModal(true);
      console.error("Submission error:", error);
    } finally {
      setLoadingButton(false);
    }
  };

  return (
    <>
    

    <main className="flex ">

      <Box
        sx={{
          marginLeft: isMobile ? '0' : '0',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 2, sm: 4 },
          bgcolor: 'background.default',
          overflowY: 'auto',
          height: '80vh',
        }}
      >
        {/* user logged icon */}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: '100%',
            maxWidth: isMobile ? '95vw': '30vw',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            bgcolor: 'white',
            borderRadius: 2,
            overflowY: 'auto',
            maxHeight: '90vh'
          }}
        >
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            mb: 2
          }}>
            <PersonAddOutlinedIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />
            <Typography 
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem' }, 
                fontWeight: 'bold', 
                color: 'text.primary' 
              }}
            >
              Enregistrer un nouveau client
            </Typography>
          </Box>

        

          {/* new input of customer id input */}
          <InputCustomerID
            control={control}
            setValue={setValue}
            reset={reset}
            customerSelectedData={customerSelectedData}
            setCustomerSelectedData={setCustomerSelectedData}
          />


          {/* selecte where the customer is belog to */}
          <InputCustomerBelongTo
            control={control}
            listOfAvailableBelongTo={listOfAvailableBelongTo}
          />


          {/* enter the variant action that the customer has */}
          <InputCustomerAction
            control={control}
            listOfAvailableServices={listOfAvailableServices}
          />
          

          {/* the new field based on the selected tax */}
          <InputCustomerTaxes
            selectedTaxs={selectedTaxs}
            handleSelectTax={handleSelectTax}
            handleTaxRemove={handleTaxRemove}
            control={control}
            listOfAvailableTaxs={listOfAvailableTaxs}
          />


    
          {/*Submit */}
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            loading={loadingButton}
            sx={{ 
              mt: 6,
              textTransform: 'none',
              fontSize: '1rem',
              bgcolor: '#E6212A',
              '&:hover': {
               bgcolor: '#c31420'
              }
            }}
          >
            Enregistrer le client
          </Button>
        </Box>
      </Box>







      {/* the modal part */}
      <ModalCard 
        showModal={showModal} 
        color={modalColor}
        title={modalTitle} 
        setShowModal={setShowModal}
        icon={modalIcon} 
      >

        {customerInfo && (
          <Box className="flex flex-col gap-4" sx={{ width: '100%', maxWidth: '800px', overflowY: 'auto' }}>
            {/* Customer Information Section */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 4,
              width: '100%',
              backgroundColor: 'background.level1',
              borderRadius: 8,
              p: 3,
              boxShadow: 'sm'
            }}>
              {/* Left Column - Personal Info */}
              <Box sx={{ flex: 1.5 }}>
                <Typography level="title-md" sx={{ mb: 2, color: 'primary.600', fontWeight: 'bold' }}>
                  Informations personnelles
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'auto 1fr', gap: '8px 16px', alignItems: 'center' }}>
                  
                  
                  <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>ID:</Typography>
                  <Typography>{parseInt(getValues('user_id'))}</Typography>
                  
                  <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Prénom:</Typography>
                  <Typography>{customerInfo.data.nom}</Typography>
                  
                  <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Nom:</Typography>
                  <Typography>{customerInfo.data.prenom}</Typography>
                  
                  <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Téléphone:</Typography>
                  <Typography>{customerInfo.data.mobile}</Typography>
                  

                  <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Email:</Typography>
                  <Typography>{customerInfo.data.email}</Typography>
                  
                 
                  <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Wilaya:</Typography>
                  <Typography>{customerInfo.data.wilaya}</Typography>
                  
                  <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Daira:</Typography>
                  <Typography>{customerInfo.data.daira}</Typography>
                  
                  <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Commune:</Typography>
                  <Typography>{customerInfo.data.commune}</Typography>
                  
                  <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Adresse:</Typography>
                  <Typography>{customerInfo.data.adresse}</Typography>
      
                  {/* <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Client de:</Typography>
                  <Typography>{formDataSaving.customer_belong_to === 'autre' ? formDataSaving.customer_belong_to_name_autre : listOfAvailableBelongTo.find(item => item.id === formDataSaving.customer_belong_to).name}</Typography>
                  */}
                </Box>
              </Box>

              {/* Vertical Divider */}
              <Divider orientation="vertical" />
              
              {/* Right Column - Payment Info */}
              <Box sx={{ flex: 1 }}>
                <Typography level="title-md" sx={{ mb: 2, color: 'primary.600', fontWeight: 'bold' }}>
                  Informations de paiement
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? '1fr' : 'auto 1fr', 
                  gap: '12px 16px',
                  alignItems: 'center',
                  width: 'max-content' 
                }}>


                  { Number(formDataSaving.customer_apport_personnel) > 0 && (
                    <>
                      <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Apport personnelle:</Typography>
                      <Typography>{formDataSaving?.customer_apport_personnel} DA</Typography>
                    </>
                  )

                  }


                  { Number(formDataSaving.customer_frais_service) > 0 && (
                    <>
                      <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Frais des service:</Typography>
                      <Typography>{formDataSaving?.customer_frais_service} DA</Typography>
                    
                      <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Service:</Typography>
                      <Typography>{formDataSaving?.customer_service_name}</Typography>
                    
                    </>
                  )

                  }



                  { Number(formDataSaving.customer_frais_virement) > 0 && (
                    <>
                      <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Frais de virement:</Typography>
                      <Typography>{formDataSaving?.customer_frais_virement} DA</Typography>
                    </>
                  )}


                  { Number(formDataSaving.customer_frais_ramassage) > 0 && (
                    <>
                      <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Frais de ramassage:</Typography>
                      <Typography>{formDataSaving?.customer_frais_ramassage} DA</Typography>
                    </>
                  )}

                  { Number(formDataSaving.customer_frais_cash) > 0 && (
                    <>
                      <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Frais de cash:</Typography>
                      <Typography>{formDataSaving?.customer_frais_cash} DA</Typography>
                    </>
                  )}

                  

                  

                  {/* show the dynamic taxes added if they existed */}
                  {
                    (formDataSaving?.extra_taxes_for_paying.length > 0) && (
                      
                      formDataSaving?.extra_taxes_for_paying.map((tax, index) => {
                        
                        //need to get the tax name form the list of selec
                        const selectedTax = selectedTaxs?.find(t => String(t.id) === String(tax.tax_id));

                        console.log('seleced taxes :', selectedTaxs);
                        
                        console.log('selected tax:',selectedTax);
                        

                        return (
                          <React.Fragment key={tax.id}>
                            <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{selectedTax ? selectedTax.tax_name : 'Tax inconnue'}:</Typography>
                            <Typography>{tax.amount} DA</Typography>
                          </React.Fragment>
                        )
                      })
                    )

                  }

                </Box>
                
                <Box sx={{ 
                  mt: 3, 
                  p: 2, 
                  backgroundColor: 'background.level2', 
                  borderRadius: 4,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography level="title-sm">Total:</Typography>
                  <Typography level="title-lg" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {(
                      Number(formDataSaving?.customer_apport_personnel) +
                      Number(formDataSaving?.customer_frais_service) +
                      Number(formDataSaving?.customer_frais_virement) +
                      Number(formDataSaving?.customer_frais_ramassage) +
                      Number(formDataSaving?.customer_frais_cash) +
                      //add to it the dynamic taxes if they are added
                      (formDataSaving?.extra_taxes_for_paying || []).reduce((sum, tax) => sum + (tax.amount) || 0, 0)

                    )} DA
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {/* Products Section */}
            <Box sx={{ 
              backgroundColor: 'background.level1',
              borderRadius: 8,
              p: 3,
              boxShadow: 'sm'
            }}>
              <Typography level="title-md" sx={{ mb: 2, color: 'primary.600', fontWeight: 'bold' }}>
                Produits achetés
              </Typography>
              
              <Box sx={{ 
                maxHeight: '200px', 
                overflowY: 'auto',
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                p: 2
              }}>
                {customerInfo.data.produits.map((product, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1,
                      borderBottom: index < customerInfo.data.produits.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography>{product.produit} ({product.marque || 'N/A'})</Typography>
                    <Typography sx={{ fontWeight: 'medium' }}>
                      {Number(product.prix)} DA × {product.quantité}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Confirmation Button */}
            <Button
              fullWidth
              size="large"
              variant="contained"
              color="primary"
              loading={loadingButton}
              disabled={loadingButton}
              sx={{ 
                mt: 2,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                textTransform: 'none',
              }}
              onClick={async () => {
                await handleSaveCustomerData({
                  setLoadingButton,
                  formDataSaving,
                  setCustomerInfo,
                  setShowModal,
                  setModalIcon,
                  setModalColor,
                  setModalTitle,
                  reset, // Pass reset here
                  setCustomerSelectedData, // Optionally reset selected customer
                  setSelectedTaxs,         // Optionally reset selected taxes
                  setListOfAvailableTaxs   // Optionally reset available taxes
                })
              }}
            >
              Confirmer l'enregistrement
            </Button>
          </Box>
        )}

        </ModalCard>
    
    
    
    </main>
    </>
  );
}