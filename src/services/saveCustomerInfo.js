export default async function saveCustomerInfo(data,setCustomreInfo, setLoadingButton) {
  
  
  const url = `${import.meta.env.VITE_BACKEND_URL}create-customer/`;
  
  //setLoadingButton(true);

  try {

    setLoadingButton(true);


    console.log('data for saving', data);
    

    const request = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    if (request.ok) {
      console.log('customer created successfully');
      const responseData = await request.json();
      console.log(responseData);
      setCustomreInfo(null);
      
      // Adding latency
      
      setLoadingButton(false);
      
      return responseData;
    } else {
      // Adding latency
      
      setLoadingButton(false);
     
      console.log('customer could not be created');
      setCustomreInfo(null);
      return null;

    }
  } catch (error) {
    console.error('Error creating customer:', error);
    // Adding latency
    
    setLoadingButton(false);
    
    setCustomreInfo(null);
    
    return null;
  }
}