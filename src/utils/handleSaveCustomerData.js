import React from 'react';

import saveCustomerInfo from "../services/saveCustomerInfo";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import getAllListOfTaxs from '../services/getAllListOfTaxs';


export default async function handleSaveCustomerData(
{  setLoadingButton, 
  formDataSaving, 
  setCustomerInfo,
  setShowModal,
  setModalIcon,
  setModalColor,
  setModalTitle,
  reset, // reset the form
  setCustomerSelectedData, // reset selected customer
  setSelectedTaxs,         // reset selected taxes
  setListOfAvailableTaxs   // reset available taxes
}
){
  console.log('button clicked for saving customer data')
  setLoadingButton(true)
  const result = await saveCustomerInfo(formDataSaving, setCustomerInfo, setLoadingButton);

  setTimeout(() => {
    setLoadingButton(false)
    console.log('button clicked , setting loading button to false');
    
  }, 500);

  //set laoding false when finished
  if (result){
    console.log('customer saved successfully');
    
    setShowModal(true)
    //setModalIcon(setModalIcon(React.createElement(CheckCircleOutlinedIcon, { fontSize: 'large' })))
    setModalColor('success')
    setModalTitle('Enregistrement réussi')

    //reset the form and selected customer data
    reset(); // Reset the form
    //clear the selected customer data
    setCustomerSelectedData(null);

    //clear the selected taxes
    setSelectedTaxs([]);

    //reset the available taxes
    const fetchListOfTaxs = async () => {
      try {
        const taxsList = await getAllListOfTaxs();
        setListOfAvailableTaxs(taxsList);

      } catch (error) {
        console.error("Error fetching list of taxs:", error);
        //setModalIcon(<ReportOutlinedIcon fontSize='large'/>);
        setModalColor('danger');
        setModalTitle('Error fetching list of taxs');
        setShowModal(true);
        
      }
    }
    fetchListOfTaxs();

  }else {
    console.log('customer not saved');
    //show the error message
    
    setShowModal(true)
    //setModalIcon(React.createElement(ReportOutlinedIcon , { fontSize: 'large' }))
    setModalTitle("Échec de l'enregistrement, l'ID du client est peut-être déjà utilisé ou une erreur serveur est survenue")
    setModalColor('danger');

    alert('Saving customer failed.');
  }
    


}