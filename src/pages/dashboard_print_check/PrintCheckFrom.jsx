import React from "react";
import { Box, Typography, Select, Option} from "@mui/joy"
import { Button, TextField, IconButton, Paper, Divider, List, ListItem, ListItemText } from "@mui/material";

import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { useForm, Controller, set } from 'react-hook-form';
import ComboTextInput  from "../../components/UI/ComboTextInput";
import { useState, useEffect } from "react";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

import ModalCard from "../../components/UI/ModalCard";



//function to get list of all taxs from the server
import getAllListOfTaxs from "../../services/getAllListOfTaxs";

// import the tax adding from component
import TaxAddingForm from "../../components/UI/TaxAddingForm";

//import the plus button for adding new tax that are alredy added by the superuser
import PlusButtonForAddingTax from '../../components/UI/PlusButtonForAddingTax';

import useIsMobile from "../../hooks/useIsMobile";


export default function PrintCheckFrom() {
  

  const isMobile = useIsMobile();


  const [customerName, setCustomerName] = useState('');
  const [customerSelectedData, setCustomerSelectedData] = useState();


  const [showModal, setShowModal] = useState(false);




  //state to store the list of taxs
  const [allTaxsList, setAllTaxsList] = useState([])



  //state to store the list of available taxs
  //this will be the taxs that are available to be selected by the user
  const [listOfAvailableTaxs, setListOfAvailableTaxs] = useState([]);

  //state to store the list of taxs that are selected by the user
  const [selectedTaxs, setSelectedTaxs] = useState([]);


  const { control, handleSubmit, formState: { errors }, setValue, getValues, reset, unregister } = useForm({
    defaultValues: {
      user_id: '',
      pay_method: '',
      amount_paid_service: '',
      amount_paid_apport_personnel:'',
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





  useEffect(() => {
    console.log('customerSelectedData form print recu :',customerSelectedData);
  }, [customerSelectedData]);
    

  //function to get the customer info from database if the user id is set in the input field
  

  useEffect(() => {
    if (getValues('user_id')) {
      console.log('getValues user_id :', getValues('user_id'));
      
    }
  },[getValues('user_id')]);
  

  useEffect(() => {
    console.log('customer selected data changed:', customerSelectedData);
    
  }), [customerSelectedData]
  




  //funciton to handle the selected taxs
  const handleSelectTax = (selectTax) => {
    console.log('Selected tax:', selectTax);
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



    const onSubmit = async (data) => {
    console.log('Submitting form...');

    try{

      const url = `${import.meta.env.VITE_BACKEND_URL}pdf/`

      const response = await fetch(url, {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          payment: {
            //date: "2025-05-12",
            //last_name: "Smith",
            //first_name: "Alice",
            //address: "456 Market St",
            //payer_name: "Cash Payment",
            user_id: data.user_id,
            pay_method: "en espèces",
            
            amount_paid_apport_personnel: data.amount_paid_apport_personnel,
            amount_paid_service: data.amount_paid_service,

            //dynamic taxs
            selected_taxs: selectedTaxs.reduce((acc, tax) => {
              acc[tax.id] = data[tax.id] || 0;
              return acc;
            }, {}),

            //calculate the total amount paid
            // amount_paid_total: 
            //   Number(data.amount_paid_apport_personnelle) +
            //   Number(data.amount_paid_service) + 
            //   selectedTaxs.reduce((total, tax) => total + Number(data[tax.id]), 0),


          }
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        console.log('blob: ', blob);
        
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'receipt.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url)

        //reset the form
        reset()
        setCustomerSelectedData(null); // Reset the selected customer data
        setCustomerName(''); // Reset the customer name input
        setSelectedTaxs([])
      }
      else {
        setShowModal(true);
        alert('Failed to generate the PDF');
        throw new Error('faild to generate the pdf');
      }
    }
    catch (error) {
      setShowModal(true);
      console.log(error)
      alert('An error occurred while downloading the PDF');
      
    }
    
  }
  
  
  return (
    <main>
      <Box
        className="h-auto"
        sx={{
          
          marginLeft: isMobile ? '0vw' : '15vw',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 2, sm: 4 },
          bgcolor: 'background.default'
        }}
      >

        
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '400px', md: '500px' },
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            p: 3,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflowY: 'auto',
            maxHeight: '80vh', // Limit height for scrolling
          }}
        >


          {/* top section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            mb: 2
          }}>
            <LocalPrintshopIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />
            <Typography 
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem' }, 
                fontWeight: 'bold', 
                color: 'text.primary' 
              }}
            >
              Imprimer le reçu
            </Typography>
          </Box>



          {/* form fields */}

          {/* select the client who will pay */}
          <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
            Client
          </Typography>

          <Controller
            name="user_id"
            control={control}
            rules={{ 
              required: "L'ID utilisateur est requis",
              validate: value => 
                (value && parseInt(value) > 0) || "L'ID utilisateur doit être positif" 
            }}
            render={({ field, fieldState }) => (
              <Box>
                <ComboTextInput 
                  customerName={customerName} // Changed from name={customerName}
                  onCustomerSelect={(customer) => {

                    if (customerSelectedData?.customer_id !== customer.customer_id) {
                      
                      // Update the form field value
                      field.onChange(customer.customer_id);
                      
                      console.log("Selected customer ID:", customer.customer_id);
  
                      //update the state of customerSelectedData
                      setCustomerSelectedData(customer);
  
                      //reset the dynamic taxs and the form fields
                      setSelectedTaxs([]);
                      // reset({
                      //   user_id: customer.customer_id,
                      //   pay_method:'',
                      //   amount_paid_service: '',
                      //   amount_paid_apport_personnelle: '',
                      // })
                    }
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





          {customerSelectedData && isMobile && (
        
          <Box sx={{ 

            alignSelf: 'center',
            
            }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width:isMobile? '100%' : 360, mx: isMobile ? 0 :1, my:1 }}>
              <Typography sx={{fontWeight:'bold', fontSize:'1.3rem'}}>
                Informations client:
              </Typography>

              <List >
                <ListItem sx={{padding:0}}>
                  <ListItemText
                    primary="Nom complet de client"
                    secondary={`${customerSelectedData.customer_firstname } ${customerSelectedData.customer_lastname }`}
                  />
                </ListItem>
                <Divider />




                {/* total of tax amount */}
                <ListItem sx={{padding:0}}>
                  <ListItemText
                    primary='Total des taxes'
                    secondary={
                      `
                        ${customerSelectedData.customertaxtracking_set.reduce((acc, item) => acc + Number(item.amount), 0) + Number(customerSelectedData.customer_frais_service) + Number(customerSelectedData.customer_apport_personnel)}
                        DA
                      `
                      
                    }
                    
                  />
                </ListItem>
                <Divider />



                {/* show the customer service tax to status */}
                <ListItem sx={{padding:0}}>
                  <ListItemText
                    primary={`Service (${customerSelectedData.customer_service_name})`}
                    secondary={`${Number(customerSelectedData.customer_frais_service) } DA`}
                  />
                </ListItem>
                <Divider />
                
                {/* show the customer apport personnle tax to status */}
                <ListItem sx={{padding:0}}>
                  <ListItemText
                    primary={`Apport personnel`}
                    secondary={`${Number(customerSelectedData.customer_apport_personnel)} DA`}
                  />
                </ListItem>
                <Divider />


                {/* show the rest of the custome taxes */}
                {
                  customerSelectedData.customertaxtracking_set.map((tax) => {
                    return (
                      <React.Fragment key={tax.tax}>
                        <ListItem sx={{padding:0}}>
                          <ListItemText
                            primary={tax.tax_name}
                            secondary={`${Number(tax.amount) } DA`}
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    )
                  })
                }

              </List>
            </Paper>
          </Box>
        
        /*   
          <Box className='border-2 p-6 self-start mt-[16.5rem] ml-[4rem]'>
            <Typography sx={{fontWeight:  'bold', fontSize:'1.3rem'}}>Informations client: </Typography>
              <ul>
                <li>
                  <Typography><strong>Nom complete de client:</strong> {customerSelectedData.customer_firstname || 'username'} {customerSelectedData.customer_lastname || 'username'} </Typography>
                </li>
                
                <li>
                    <Typography><strong>Livraison actuelle:</strong> {customerSelectedData.customer_livraison_current || 'livraison'} (DA)</Typography>
                </li>
                
                <li>
                  <Typography><strong>Ramassage actuelle:</strong> {customerSelectedData.customer_ramassage_start || 'ramassage'} (DA)</Typography>
                </li>

                <li>
                  <Typography><strong>Service actuelle:</strong> {customerSelectedData.customer_service_current || 'service'} (DA)</Typography>
                </li>

                <li>
                  <Typography><strong>Apport personnel:</strong> {customerSelectedData.customer_apport_personnel_current || 'apport personnel'} (DA)</Typography>
                </li>
              </ul>
          </Box>
        */
        )} 







          {/* typed the amount paid of apport personnel*/}
          <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
            Apport personnel
          </Typography>
          
          <Controller
            name="amount_paid_apport_personnel"
            control={control}
            rules={{ 
              required: "Le montant est requis",
              min: { value: 0, message: "Le montant doit être supérieur ou egale 0" },
              validate: {
                maxThreeDecimals: (value) =>
                  /^-?\d+(\.\d{1,3})?$/.test(value) || "Maximum 3 chiffres après la virgule",
                notMoreThanAvailable: (value) => 
                  !customerSelectedData || Number(value) <= Number(customerSelectedData.customer_apport_personnel)
                  || "Le montant ne peut pas être supérieur à l'apport personnel disponible"
                
              }
            
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                inputProps={{ step: 'any', min: 0 }}
                label="Apport personnel payé (DA)"
                placeholder="Entrez le montant"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          
          
          {/* typed the amount paid of services */}
          
          <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
            Service
          </Typography>
          
          <Controller
            name="amount_paid_service"
            control={control}
            rules={{ 
              required: "Le montant est requis",
              min: { value: 0, message: "Le montant doit être supérieur ou egale 0" },
              validate: {
                maxThreeDecimals: (value) =>
                  /^-?\d+(\.\d{1,3})?$/.test(value) || "Maximum 3 chiffres après la virgule",
                notMoreThanAvailable: (value) => 
                  !customerSelectedData || Number(value) <= Number(customerSelectedData.customer_frais_service)
                  || "Le montant ne peut pas être supérieur au service disponible"
                
              }
            
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                inputProps={{ step: 'any', min: 0 }}
                label="Service payé (DA)"
                placeholder="Entrez le montant"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />





          {/* the dynamic form for extra taxes that he will pays */}

          {selectedTaxs.map((tax) => {
           
            const customerTax = customerSelectedData?.customertaxtracking_set?.find(t => t.tax === tax.id);
            const maxAmount = customerTax ? Number(customerTax.amount) : undefined;

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

                rules={{ 
                  required: `${tax.tax_name} est requis`,
                  validate: {
                    isNumber: (value) => 
                      !isNaN(parseFloat(value)) || `${tax.tax_name} doit être un nombre`,
                    isNonNegative: (value) => 
                      parseFloat(value) >= 0 || `${tax.tax_name} doit être positif ou 0`,
                    maxThreeDecimals: (value) =>
                      /^-?\d+(\.\d{1,3})?$/.test(value) || "Maximum 3 chiffres après la virgule",
                    validate: value =>
                      !maxAmount || Number(value) <= maxAmount
                    || `Le montant ne peut pas être supérieur à ${maxAmount ?? 0}`                   
                  }
                }}

                
              />
            )
          })}




          {/* the dynamic button to add dynamic taxes that he will pays */}
          
            <PlusButtonForAddingTax 
              availableTaxs={listOfAvailableTaxs} 
              onTaxSelect={handleSelectTax}
            />






          {/* submit button */}
        
          <Button
            type="submit" 
            variant="contained" 
            size="large"
            sx={{ 
              mt: 2,
              bgcolor: '#E6212A',
              '&:hover': {
                bgcolor: '#c31420'
              }
            }}
          >Crée le reçu</Button>
        </Box>







        {/* show the  data of customer we selected */}

        

        {customerSelectedData && !isMobile && (
        
          <Box sx={{ 
            mt: '5.5rem', 
            ml: '4rem', 
            alignSelf: 'start',
            overflowY: 'auto',
            maxHeight: '68vh',
            
            
            }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, minWidth: 360, mx: 1, my:1 }}>
              <Typography sx={{fontWeight:'bold', fontSize:'1.3rem'}}>
                Informations client:
              </Typography>

              <List >
                <ListItem sx={{padding:0}}>
                  <ListItemText
                    primary="Nom complet de client"
                    secondary={`${customerSelectedData.customer_firstname } ${customerSelectedData.customer_lastname }`}
                  />
                </ListItem>
                <Divider />




                {/* total of tax amount */}
                <ListItem sx={{padding:0}}>
                  <ListItemText
                    primary='Total des taxes'
                    secondary={
                      `
                        ${customerSelectedData.customertaxtracking_set.reduce((acc, item) => acc + Number(item.amount), 0) + Number(customerSelectedData.customer_frais_service) + Number(customerSelectedData.customer_apport_personnel)}
                        DA
                      `
                      
                    }
                    
                  />
                </ListItem>
                <Divider />



                {/* show the customer service tax to status */}
                <ListItem sx={{padding:0}}>
                  <ListItemText
                    primary={`Service (${customerSelectedData.customer_service_name})`}
                    secondary={`${Number(customerSelectedData.customer_frais_service) } DA`}
                  />
                </ListItem>
                <Divider />
                
                {/* show the customer apport personnle tax to status */}
                <ListItem sx={{padding:0}}>
                  <ListItemText
                    primary={`Apport personnel`}
                    secondary={`${Number(customerSelectedData.customer_apport_personnel)} DA`}
                  />
                </ListItem>
                <Divider />


                {/* show the rest of the custome taxes */}
                {
                  customerSelectedData.customertaxtracking_set.map((tax) => {
                    return (
                      <React.Fragment key={tax.tax}>
                        <ListItem sx={{padding:0}}>
                          <ListItemText
                            primary={tax.tax_name}
                            secondary={`${Number(tax.amount) } DA`}
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    )
                  })
                }

              </List>
            </Paper>
          </Box>
        
        /*   
          <Box className='border-2 p-6 self-start mt-[16.5rem] ml-[4rem]'>
            <Typography sx={{fontWeight:  'bold', fontSize:'1.3rem'}}>Informations client: </Typography>
              <ul>
                <li>
                  <Typography><strong>Nom complete de client:</strong> {customerSelectedData.customer_firstname || 'username'} {customerSelectedData.customer_lastname || 'username'} </Typography>
                </li>
                
                <li>
                    <Typography><strong>Livraison actuelle:</strong> {customerSelectedData.customer_livraison_current || 'livraison'} (DA)</Typography>
                </li>
                
                <li>
                  <Typography><strong>Ramassage actuelle:</strong> {customerSelectedData.customer_ramassage_start || 'ramassage'} (DA)</Typography>
                </li>

                <li>
                  <Typography><strong>Service actuelle:</strong> {customerSelectedData.customer_service_current || 'service'} (DA)</Typography>
                </li>

                <li>
                  <Typography><strong>Apport personnel:</strong> {customerSelectedData.customer_apport_personnel_current || 'apport personnel'} (DA)</Typography>
                </li>
              </ul>
          </Box>
        */
        )} 



      </Box>









      

      <ModalCard
        title={'Erreur de creation de PDF'}
        showModal={showModal} 
        setShowModal={setShowModal} 
        icon={<ErrorOutlineOutlinedIcon fontSize="large"/>} 
        color={'danger'}
      />
    </main>
  )
}