import { Component } from "react";
import createDataForPaying from "../utils/createDataForPaying";

import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';


import React from "react";


export default async function postCustomerPay(data, setModalIcon, setModalColor, setModalTitle, setShowModal, setCustomerInfoData) {

  console.log('postCustomerPay data', data);
  


  try {

      

      const url = `${import.meta.env.VITE_BACKEND_URL}pay/`;
    
      const bodyData = createDataForPaying(data)

      console.log('bodyData for postCustomerPay', bodyData);
      
    
      const request = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: bodyData
      });
    
      if (request.ok) {
        const response = await request.json();
      
        console.log('request from the saving customer pay', response);
        alert('save pay complete');
    
        //clear the data to hide the child part
        setCustomerInfoData(null);
        
        //show the seccess modal
                
        setModalIcon(React.createElement(CheckCircleOutlineOutlinedIcon,{fontSize: 'large'}))
        setModalColor('success')
        setModalTitle('Terminé avec succès');  
        setShowModal(true);

        //update the apport personnel in the other database
    
        return response;
      }else{
        alert('save pay failed');
        //clear the data to hide the child part
        setCustomerInfoData(null);
        
        setModalIcon(
          React.createElement(ReportProblemOutlinedIcon,{fontSize: 'large'})
        )
        setModalColor('danger')
        setModalTitle('faild maybe server prblem or internet conection');  
        setShowModal(true);
    
        
        
        return null;
      }
  } catch (error) {
    alert('save payment est fail');
    //clear the data to hide the child part
    setCustomerInfoData(null);

    setModalColor('danger')
    setModalTitle('faild maybe server prblem or internet conection');  
    setShowModal(true);
    
    return null;
  }

  


}