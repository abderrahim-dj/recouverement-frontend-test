import createDataForEdit from '../utils/createDataForEdit';


export default async function updateCustomer(customerId, updatedData) {
  const url = `${import.meta.env.VITE_BACKEND_URL}update/${customerId}`;
  const token = localStorage.getItem('token');
  console.log('data to update', updatedData);




  try{
    const request = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updatedData),
    })
  
    if (request.ok) {
      const response = await request.json();
      console.log('update response',response);
      return response;   
    }else {
  
      throw new Error('Failed to update customer');
    }

  }catch(err){
    console.error('Error updating', err);
  }
  
}