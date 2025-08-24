import { useForm, useWatch, Controller, set } from "react-hook-form";
import ModalCard from "../../components/UI/ModalCard";
import { TextField, Button , Box as MuiBox, Typography as MuiTypography, Divider as MuiDivider } from "@mui/material";
import { Box, Typography, Divider } from "@mui/joy";
import { useEffect, useState } from "react";
import updateCustomer from "../../services/updateCustomer";
import Chip from '@mui/material/Chip';

//import for the dynamic taxes 
//import the plus button for adding new tax that are alredy added by the superuser
import PlusButtonForAddingTax from '../../components/UI/PlusButtonForAddingTax';


//import the function that will fetch the list of taxs
import getAllListOfTaxs from '../../services/getAllListOfTaxs';

// import the tax adding from component
// import TaxAddingForm from '../../components/UI/TaxAddingForm';


import useIsMobile from "../../hooks/useIsMobile";


import AddingDynamicActionsEdit from "./AddingDynamicActionsEdit";
import TaxAddingFormEdit from "./TaxAddingFormEdit";

import createDataForEdit from "../../utils/createDataForEdit";



export default function FormEditCustomer({
  activeRow,
  data,
  showModal,
  color,
  title,
  setShowModal,
  icon,
  onSubmitSuccess,
  onSubmitFailed
}) {
  
  

  const isMobile = useIsMobile();
  
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
    setValue,
    control,
    unregister
  } = useForm();

  // Watch form values for live total calculation
  const watchedValues = useWatch({
    control,
    defaultValue: {      

      //customer_apport_personnel_edit: 0, // i will delete this later
      //customer_frais_service_edit: 0, // i will delete this later
      actions:[],

      // the dynamic taxes that the user already has
      ...activeRow.customertaxtracking_set.reduce((acc, tax) => {
        acc[tax.tax] = tax.amount || 0; // Initialize with existing tax amounts
        return acc;
      }, {})
    }
  });


  
  useEffect(() => {
    
    console.log('watchedValues ', watchedValues);
  }, [watchedValues])
  





  //state to store the list of taxs
  const [allTaxsList, setAllTaxsList] = useState([])

  //state to store the list of available taxs
  //this will be the taxs that are available to be selected by the user
  const [listOfAvailableTaxs, setListOfAvailableTaxs] = useState([]);


  //state to store the list of taxs that are selected by the user
  const [selectedTaxs, setSelectedTaxs] = useState([]);

  // Create a new state to store the original tax values at the top of your component
  const [originalTaxValues, setOriginalTaxValues] = useState({});


  //useEffect to set the selectedTaxes if the customer already have some of them
  useEffect (() => {
    if (
      allTaxsList.length > 0 &&
      activeRow?.customertaxtracking_set.length > 0 &&
      selectedTaxs.length === 0
    ) {


      //Create a map of customer tax IDs to their amounts
      const customerTaxMap =  {};
      activeRow.customertaxtracking_set.forEach(tax => {
        customerTaxMap[tax.tax] = tax.amount
      })

      // Save the original tax values for later use when re-adding
      setOriginalTaxValues(customerTaxMap); 


      //set teh selected tax with their amounts
      const initialSelected = allTaxsList
      .filter(tax => customerTaxMap.hasOwnProperty(tax.id))
      .map(tax => ({
        ...tax,
        amount: customerTaxMap[tax.id]
      }));

      setSelectedTaxs(initialSelected);



      
      //set the list of customer taxes
      //const customerTaxIds = activeRow.customertaxtracking_set.map(tax => tax.tax);
      
      
      // merge the customer tax amount with the selected taxes
      // const initialSelected = allTaxsList
      // .filter(tax => customerTaxMap.hasOwnProperty(tax.id))
      // .map(tax => 
      //   ({
      //     ...tax,
      //     amount: customerTaxMap[tax.id]
      //   })
      // )

      //console.log('initialSelected ', initialSelected);
      

      
      //const initialSelected = allTaxsList.filter(tax => customerTaxIds.includes(tax.id));
      // setSelectedTaxs(initialSelected);

      //set default value for each tax in the form
      // initialSelected.forEach( tax => {
      //   setValue(`${tax.id}`, Number(tax.amount) || 0)
      // })


      //set the available taxes the rest of them
      // const initialAvailable = allTaxsList.filter(tax => !customerTaxMap.hasOwnProperty(tax.id))
      // setListOfAvailableTaxs(initialAvailable)

      //console.log('initialSelected ', initialSelected);
      
    }
  },[allTaxsList, activeRow, setValue])




  //useEffect to fetch the list of taxs when laoding the component
  useEffect(() => {
    //fetch the list of taxs from the server
    const fetchListOfTaxs = async () => {
      try {
        const taxsList = await getAllListOfTaxs();
        setAllTaxsList(taxsList); //stoer all the original taxs list

        //get the taxs that are already the customer has
        const customerTaxIds = activeRow.customertaxtracking_set.map(tax => tax.tax);


        //remove the taxs that are already the customer has from the list of all taxs
        const filteredTaxs = taxsList.filter(tax => !customerTaxIds.includes(tax.id));
        
        //update the state
        setListOfAvailableTaxs(filteredTaxs); 

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





  //fucntion to get the total amount of the customer taxes
  const getTotlaTaxes = (customer) => {
    if (customer.customertaxtracking_set) {
      return customer.customertaxtracking_set.reduce(
        (sum, tax) => sum + parseFloat(tax.amount || 0), 
        0
      )
    }
  }






  //get customer data based on activeRow
  const customerID = activeRow?.customer_id;
  const customer = data?.find(item => item.customer_id === customerID) || {};
  
  useEffect(() => {
    if (customer && Object.keys(customer).length > 0) {
      reset({
        //customer_apport_personnel_edit: Number(customer.customer_apport_personnel) || 0,
        //customer_frais_service_edit: Number(customer.customer_frais_service) ||0,

      });
    }
  }, [customer, reset]);
  




  // 1. Add this useEffect to initialize the tax values properly
useEffect(() => {
  // When selectedTaxs changes, ensure the form values are properly set
  if (selectedTaxs.length > 0) {
    selectedTaxs.forEach(tax => {
      // Make sure the tax value is properly set in the form
      setValue(`${tax.id}`, Number(tax.amount) || 0);
    });
  }
}, [selectedTaxs, setValue]);


  


  // Calculate totals based on current form values
  const calculateTotals = () => {
    // const currentTotal =  
    //   parseFloat(customer.customer_apport_personnel || 0)+
    //   parseFloat(customer.customer_frais_service || 0) +
    //   getTotlaTaxes(customer) //function i made it to calculate the total ammount of taxes
    
    //   ;


    //sum all the dynamic taxes from watchedValues
    // const dynamicTaxesTotal = activeRow.customertaxtracking_set 
    //                           ? activeRow.customertaxtracking_set.reduce((sum, tax) => {
    //                               return sum + parseFloat(watchedValues[tax.tax] || 0);
    //                             }, 0)
    //                           : 0; 


    // const dynamicTaxesTotal = selectedTaxs.length > 0 
    // ? selectedTaxs.reduce((sum, tax) => {
    //   return sum + parseFloat(watchedValues[tax.id] || 0)
    // }, 0) 
    // : 0


      // Fix the dynamicTaxesTotal calculation
  const dynamicTaxesTotal = selectedTaxs.length > 0 
    ? selectedTaxs.reduce((sum, tax) => {
        // Convert tax.id to string to ensure consistency
        const taxId = String(tax.id);
        const taxValue = parseFloat(watchedValues[taxId] || 0);
        console.log(`Tax: ${tax.tax_name}, ID: ${taxId}, Value: ${taxValue}`);
        return sum + taxValue;
      }, 0) 
    : 0;


    //calculate the total of actions
    const actionsTotal = Array.isArray(watchedValues.actions)
    ? watchedValues.actions.reduce((sum, action) => {
      return sum + parseFloat(action.value || 0);
    }, 0)
    : 0;

    console.log('dynamicTaxesTotal ', dynamicTaxesTotal);
    console.log('actionsTotal ', actionsTotal);

                        
    const modifiedTotal =  
      // need to make it watch the dynamic taxes
      dynamicTaxesTotal +
      actionsTotal // Add the total of actions to the modified total;

      ;

      
    return {
      modifiedTotal: modifiedTotal.toFixed(3),
      //currentTotal: currentTotal.toFixed(3) || 0
    };
  };
  const { modifiedTotal /* currentTotal */ } = calculateTotals();
  






  //funciton to handle the selected taxs
  const handleSelectTax = (selectTax) => {
    //remove the tax from the list of available taxs
    setListOfAvailableTaxs(prev=> prev.filter(tax => tax.id !== selectTax.id));

    //add the tax to the selected taxs
    setSelectedTaxs(prev => [...prev, selectTax]);

     // Set the value to the original value if available, otherwise 0
    const originalValue = originalTaxValues[selectTax.id] || 0; // Use original value or default to 0
    setValue(`${selectTax.id}`, originalValue); // Set default value to original value for new tax
  };


  //function to handle tax removal
  const handleTaxRemove = (taxToRemove) => {
    // Remove from selected taxes
    setSelectedTaxs(prev => prev.filter(tax => tax.id !== taxToRemove.id));
    
    // Add back to available taxes
    setListOfAvailableTaxs(prev => [...prev, taxToRemove]);

    // Unregister the tax field from the form
    unregister(taxToRemove.id)

    console.log('tax to remove', taxToRemove);
    
    
  };






  const onSubmit = async (formData) => {
    console.log("Updated Data:", formData);

    //format the formData to match the expected structure
    // Create data for edit
    const dataForEdit = createDataForEdit(formData);



    // Function to update the customer data in the database
    try {
      const updated = await updateCustomer(activeRow.customer_id, dataForEdit);

      if (!updated) {

        setShowModal(false);
        if (typeof onSubmitFailed === 'function') {
          onSubmitFailed();
        }
        alert("Failed to update customer");
        return;
      }
      console.log('update response', updated);
      alert("Customer updated successfully");
      setShowModal(false); // Only close on success

      console.log('response from updateCustomer', updated);
      



      // Build the new customertaxtracking_set from selectedTaxs and formData
      const updatedCustomertaxtrackingSet = selectedTaxs.map(tax => ({
        tax: tax.id,
        tax_name: tax.tax_name,
        amount: formData[tax.id] || 0,
      }));


      //update the local data
      const updatedCustomer= {
        ...activeRow,
        //customer_apport_personnel: formData.customer_apport_personnel_edit,
        //customer_frais_service: formData.customer_frais_service_edit,
        customer_id: activeRow.customer_id,
        is_validated: updated.customer_is_validated,


        customertaxtracking_set: updatedCustomertaxtrackingSet,

        customer_apport_personnel: dataForEdit.customer_apport_personnel,
        customer_frais_service: dataForEdit.customer_frais_service,
        customer_frais_ramassage: dataForEdit.customer_frais_ramassage,
        customer_frais_virement: dataForEdit.customer_frais_virement,
        customer_frais_cash: dataForEdit.customer_frais_cash,
      }
      
      if (typeof onSubmitSuccess === 'function') {
        onSubmitSuccess(updatedCustomer);
      }

    } catch (error) {
      alert("Failed to update customer");
      console.error("Error updating customer:", error);
    }
  };


  return (

    

    <ModalCard
      color={color}
      title={title}
      icon={icon}
      showModal={showModal}
      setShowModal={setShowModal}
    >
      {/* Use a regular div as a wrapper to isolate Joy UI from Material UI */}
      <Box 
      sx={{ 
        display: 'flex',
        width: isMobile ? '100%' : '80vw',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 1 : 3,
        //width: '100%',
        
        maxHeight: { xs: '80vh', md: '85vh' },
        overflowY: 'auto',
        px: { xs: 1, sm: 2 },
        py: 1,
        '&::-webkit-scrollbar': {
          width: '8px',
          background: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '4px'
        }
      }}
    >


      <Box sx={{
        display: 'flex',
        flexDirection:'column' ,
        width: '100%',
        height: '100%',
      }}>


        {/* Customer Profile Card */}
        <Box 
          sx={{ 
            width: isMobile ? '100%' :'100%',
            overflowY:isMobile ? 'unset': 'auto',
            maxHeight:isMobile ? 'auto' :'70vh',
            height: isMobile ? '100%' :'50%',
            //width:'fit-content',
            bgcolor: 'background.surface', 
            borderRadius: 2,
            p: 3,
            mb: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: isMobile ? 'unset': 'auto',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              backgroundColor: 'primary.main',
            
            }
          }}
        >

            {/* the part that will show the currant data of the customer */}
            <Box sx={{
              overflowY:isMobile ? 'unset' : 'auto',
              //maxHeight:'70vh',


            }}>
              {customer.is_validated === false && (
                <Chip
                  label="Prêt pour validation"
                  sx={{
                    mb: 2,
                    color: 'white',
                    fontWeight: 'bold',
                    bgcolor: '#E6212A',
                    '&:hover': {
                      bgcolor: '#c31420'
                  }
                  }}
                  //deleteIcon={<DoneIcon />}
                />

              )}

              <Typography level="title-lg" sx={{ mb: 2, fontWeight: 'bold' }}>
                Informations du client #{customer.customer_id} ({customer.customer_belong_to})
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: isMobile ? 1 : 4 }}>
                <Box>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'auto 1fr', 
                    gap: 1,
                    alignItems: 'center'
                  }}>
                    <Typography level="body-sm" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>ID:</Typography>
                    <Typography level="body-md" sx={{ fontWeight: 'medium' }}>{customer.customer_id}</Typography>
                    
                    <Typography level="body-sm" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>Prénom:</Typography>
                    <Typography level="body-md">{customer.customer_firstname}</Typography>
                    
                    <Typography level="body-sm" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>Nom:</Typography>
                    <Typography level="body-md">{customer.customer_lastname}</Typography>
                    
                    <Typography level="body-sm" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>Mobile:</Typography>
                    <Typography level="body-md">{customer.customer_mobile}</Typography>
                  </Box>
                </Box>
                
                {!isMobile && <Divider orientation="vertical" />}
                
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'auto 1fr', 
                    gap: 1,
                    alignItems: 'center'
                  }}>
                    <Typography level="body-sm" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>Wilaya:</Typography>
                    <Typography level="body-md">{customer.customer_wilaya}</Typography>
                    
                    <Typography level="body-sm" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>Daira:</Typography>
                    <Typography level="body-md">{customer.customer_daira}</Typography>
                    
                    <Typography level="body-sm" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>Commune:</Typography>
                    <Typography level="body-md">{customer.customer_commune}</Typography>
                    
                    <Typography level="body-sm" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>Adresse:</Typography>
                    <Typography level="body-md">{customer.customer_address}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>







              



        </Box>



        {/* Current Financial Summary Card */}
        <Box 
          sx={{ 
            bgcolor: 'background.surface',
            borderRadius: 2,
            p: 3,
            mb: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            overflowY: isMobile ? 'unset': 'auto',
            //maxHeight: '50vh',
            width: "100%",
            height:'100%',
            
          }}
        >



          <Typography level="title-lg" sx={{ mb: 2, fontWeight: 'bold' }}>
            Bilan financier actuel
          </Typography>
          
          <Box 
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: 'space-between',
            }}
          >
            
            {/* frais service */}
            {Number(customer.customer_frais_service) > 0 && (
              <>
                <Box 
                  sx={{ 
                    flex: '1 0 200px',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2,
                    bgcolor: 'background.level1',
                    borderRadius: 1,
                  }}
                >
                  <Typography level="body-xs" sx={{ color: 'text.secondary', mb: 0.5 }}>Frais de Service ({customer.customer_service_name})</Typography>
                  <Typography level="body-md" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                    {Number(customer.customer_frais_service).toLocaleString('fr-DZ', { maximumFractionDigits: 3 })} DA
                  </Typography>
                </Box>
              </>
            )}
            

            {/* frais apport personnel */}
            {Number(customer.customer_apport_personnel) > 0 && (
              <>
                <Box 
                  sx={{ 
                    flex: '1 0 200px',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2,
                    bgcolor: 'background.level1',
                    borderRadius: 1,
                  }}
                >
                  <Typography level="body-xs" sx={{ color: 'text.secondary', mb: 0.5 }}>Frais d'Apport personnel</Typography>
                  <Typography level="body-md" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                    {Number(customer.customer_apport_personnel).toLocaleString('fr-DZ', { maximumFractionDigits: 3 })} DA
                  </Typography>
                </Box>
              </>
            )}

            {/* frais virement */}
            {Number(customer.customer_frais_virement) > 0 && (
              <>
                <Box 
                  sx={{ 
                    flex: '1 0 200px',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2,
                    bgcolor: 'background.level1',
                    borderRadius: 1,
                  }}
                >
                  <Typography level="body-xs" sx={{ color: 'text.secondary', mb: 0.5 }}>Frais de virement</Typography>
                  <Typography level="body-md" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                    {Number(customer.customer_frais_virement).toLocaleString('fr-DZ', { maximumFractionDigits: 3 })} DA
                  </Typography>
                </Box>
              </>
            )}



            {/* frais cash */}
            {Number(customer.customer_frais_cash) > 0 && (
              <>
                <Box 
                  sx={{ 
                    flex: '1 0 200px',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2,
                    bgcolor: 'background.level1',
                    borderRadius: 1,
                  }}
                >
                  <Typography level="body-xs" sx={{ color: 'text.secondary', mb: 0.5 }}>Frais de cash</Typography>
                  <Typography level="body-md" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                    {Number(customer.customer_frais_cash).toLocaleString('fr-DZ', { maximumFractionDigits: 3 })} DA
                  </Typography>
                </Box>
              </>
            )}



            {/* frais ramassage */}
            {Number(customer.customer_frais_ramassage) > 0 && (
              <>
                <Box 
                  sx={{ 
                    flex: '1 0 200px',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2,
                    bgcolor: 'background.level1',
                    borderRadius: 1,
                  }}
                >
                  <Typography level="body-xs" sx={{ color: 'text.secondary', mb: 0.5 }}>Frais de ramassage</Typography>
                  <Typography level="body-md" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                    {Number(customer.customer_frais_ramassage).toLocaleString('fr-DZ', { maximumFractionDigits: 3 })} DA
                  </Typography>
                </Box>
              </>
            )}





            {/* the dynamic taxes */}
            {customer?.customertaxtracking_set	&& customer.customertaxtracking_set.map((tax) => {
              return (
                <Box 
                  key={tax.tax}
                  sx={{ 
                    flex: '1 0 200px',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2,
                    bgcolor: 'background.level1',
                    borderRadius: 1,
                  }}
                      
                  >
                    <Typography level="body-xs" sx={{ color: 'text.secondary', mb: 0.5 }}>{tax.tax_name}</Typography>
                    <Typography level="body-md" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                      {Number(tax.amount).toLocaleString('fr-DZ', { maximumFractionDigits: 3 })} DA
                    </Typography>

                </Box>
              )
        })}
            

          </Box>
        </Box>

      </Box>



        {!isMobile && (
          <Divider sx={{
            padding:'2px'
          }} orientation="horizontal" variant="middle" flexItem />
        )}

      {/* Edit Form Card */}

      <Box 
        sx={{ 
          bgcolor: 'background.surface',
          borderRadius: 2,
          overflowY: isMobile ? 'unset': 'auto',
          //maxHeight: '68vh',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          width: 1
        }}
      >
        <Box 
          sx={{ 
            //bgcolor: 'background.level1',
            px: 3,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography level="title-md" sx={{ fontWeight: 'bold' }}>
            Modifier les valeurs financières
          </Typography>
        </Box>
        
        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            

            <Box sx={{mb:2}}>
              <AddingDynamicActionsEdit control={control} customerSelectedData={activeRow} />
            </Box>
                      









            {/* Dynamic Taxes Section */}


            {/* the dynamic taxes form inputs */}
            { selectedTaxs.map((tax) => {
              return (
                
                <TaxAddingFormEdit
                  key={tax.id}
                  nameOfTax={tax.tax_name}
                  fieldName={`${tax.id}`}
                  control={control}
                  defaultValue={tax.amount || 0}
                  onRemove={
                    //remove the tax from the form
                    () => handleTaxRemove(tax)
                    //remove the tax value from the form
                  }
                />
              )
            })
              
            }



            {/* button to add more taxes */}
            { listOfAvailableTaxs.length > 0 && (
              <Box sx={{mt:2}}>
                <PlusButtonForAddingTax
                  availableTaxs={listOfAvailableTaxs}
                  onTaxSelect={handleSelectTax}

                />
              </Box>
            )}








            {/* Total Calculation Summary */}
            <Box 
              sx={{ 
                mt: 4, 
                p: 3, 
                bgcolor: 'background.level1',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography level="title-sm" sx={{ mb: 2, fontWeight: 'bold' }}>
                Totaux calculés
              </Typography>
              
              <Box sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 8 },
                justifyContent: 'space-between',
              }}>
                <Box>
                  <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                    Total départ
                  </Typography>
                  <Typography level="h5" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                    {parseFloat(
                      parseFloat(customer.customer_apport_personnel	 || 0) + 
                      parseFloat(customer.customer_frais_service	 || 0) + 
                      parseFloat(customer.customer_frais_ramassage || 0) +
                      parseFloat(customer.customer_frais_virement || 0) +
                      parseFloat(customer.customer_frais_cash || 0) +
                      getTotlaTaxes(customer) //function i made it to calculate the total ammount of taxes
                      ).toLocaleString('fr-DZ', { maximumFractionDigits: 3 })} DA
                  </Typography>
                </Box>
                
                <Box>
                  <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                    Total actuel
                  </Typography>
                  <Typography level="h5" sx={{ 
                    fontWeight: 'bold', 
                    color: 'primary.main',
                    mt: 0.5
                  }}>
                    {parseFloat(modifiedTotal).toLocaleString('fr-DZ', { maximumFractionDigits: 3 })} DA
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              flexDirection : isMobile ? 'column-reverse' : 'row',
              gap: 2, 
              mt: 4
            }}>
              <Button
                variant="outlined"
                color="neutral"
                onClick={() => setShowModal(false)}
                sx={{
                  px: 3,
                  py: 1,
                  fontWeight: 'medium',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'neutral.700',
                  }
                }}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                sx={{ 
                  px: 3,
                  py: 1,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  bgcolor: '#E6212A',
                  '&:hover': {
                    bgcolor: '#c31420'
                  }
                }}
              >
                Enregistrer les modifications
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
    </ModalCard>
  );
}











//old dynamic aport personnel and service part

            // {/* for the apport personnel  */}
            // <Box sx={{ mb: 2 }}>
            //   <Typography level="title-sm" sx={{ mb: 2, color: 'primary.dark', fontWeight: 'medium' }}>
            //     Apport personnel
            //   </Typography>
            //   <Box 
            //     sx={{ 
            //       display: 'grid', 
            //       gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            //       gap: 2,
            //       p: 2,
            //       bgcolor: 'background.level1',
            //       borderRadius: 1,
            //     }}
            //   >
            //     {/* Current value - read only */}
            //     <Typography
            //       sx={{
            //         alignSelf: 'center',
            //         fontWeight: 'bold',
            //       }}
            //     >
            //       Valeur initiale: {Number(customer.customer_apport_personnel	)} DA
                  
            //     </Typography>




            //     {/* Edit value - apport personnel */}
                  
            //       <Box>
            //         <Typography level="body-xs" sx={{ color: 'text.secondary', mb: 0.5 }}>
            //           Modefie le montant d'apport personnel
            //         </Typography>
                    
            //         <Controller
            //           name="customer_apport_personnel_edit"
            //           control={control}
            //           rules={{
            //             required: 'Le montant est requis',
            //             min: {value:0, message: 'Le montant doit être supérieur ou égal à 0'},
            //             validate: {
            //               maxThreeDecimals: (value) =>
            //                 /^-?\d+(\.\d{1,3})?$/.test(value) || "Maximum 3 chiffres après la virgule"
            //             }
            //           }}
            //           render={({ field, fieldState}) => (
            //             <TextField
            //               {...field}
            //               fullWidth
            //               type="number"
            //               inputProps={{ step: 'any', min:0}}
            //               //label="Annulation à modifier"
            //               variant="outlined"
            //               //value={customer.customer_frais_apport_personnel || 0}
            //               error={!!fieldState.error}
            //               helperText={fieldState.error ? fieldState.error.message : 'Entrez le montant à déduire'}
            //             >

            //             </TextField>
            //           )}
            //         >

            //         </Controller>
            //       </Box>
            //   </Box>
            // </Box>








            // {/* service part */}

            // <Box sx={{ mb: 2 }}>
            //   <Typography level="title-sm" sx={{ mb: 2, color: 'primary.dark', fontWeight: 'medium' }}>
            //     Service
            //   </Typography>
            //   <Box 
            //     sx={{ 
            //       display: 'grid', 
            //       gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            //       gap: 2,
            //       p: 2,
            //       bgcolor: 'background.level1',
            //       borderRadius: 1,
            //     }}
            //   >
            //     {/* Current value - read only */}
            //     <Typography
            //       sx={{
            //         alignSelf: 'center',
            //         fontWeight: 'bold',
            //       }}
            //     >
            //       Valeur initiale: {Number(customer.customer_frais_service)} DA
                  
            //     </Typography>




            //     {/* Edit value - service */}
                  
            //       <Box>
            //         <Typography level="body-xs" sx={{ color: 'text.secondary', mb: 0.5 }}>
            //           Modefie le montant de service
            //         </Typography>
                    
            //         <Controller
            //           name="customer_frais_service_edit"
            //           control={control}
                      
            //           rules={{
            //             required: 'Le montant est requis',
            //             min: {value:0, message: 'Le montant doit être supérieur ou égal à 0'},
            //             validate: {
            //               maxThreeDecimals: (value) =>
            //                 /^-?\d+(\.\d{1,3})?$/.test(value) || "Maximum 3 chiffres après la virgule"
            //             }
            //           }}
            //           render={({ field, fieldState}) => (
            //             <TextField
            //               {...field}
            //               fullWidth
            //               type="number"
            //               inputProps={{ step: 'any', min:0}}
            //               //label="Annulation à modifier"
            //               variant="outlined"
            //               //value={customer.customer_achat || 0}
            //               error={!!fieldState.error}
            //               helperText={fieldState.error ? fieldState.error.message : 'Entrez le montant à déduire'}
            //             >

            //             </TextField>
            //           )}
            //         >

            //         </Controller>
            //       </Box>



                  
            //   </Box>
            // </Box>