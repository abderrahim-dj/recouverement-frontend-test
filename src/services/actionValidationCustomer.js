export default async function actionValidationCustomer(customerId) {
  
  const url = `${import.meta.env.VITE_BACKEND_URL}customer-approved-action/${customerId}`;
  
  try{
    const request = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      },
    });

    if (request.ok) {
      const response = await request.json();
      console.log('validate response',response);
      return response;   
    }else {
  
      throw new Error('Failed to validate customer');
    }

  }catch(err){
    console.error('Error validating', err);
  }
  
}