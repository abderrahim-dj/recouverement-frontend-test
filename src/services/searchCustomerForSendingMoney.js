//this function is fetching the list of customers for sending the transaction the user need it to know how much money he collect from this client

export default async function searchCustomerForSendingMoney(searchTerm) {
  const url = `${import.meta.env.VITE_BACKEND_URL}search-customer/?search=${searchTerm}`;

  try {
    const request = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      }
    });
    
    if (request.ok) {
      const responseData = await request.json();
      console.log('response search users for sending money', responseData);
      return responseData;
    } else {
      console.log('users search for sending money could not be fetched');
      return null;
    }
  } catch (error) {
    console.error('Error fetching search users for sending money:', error);
    return null;
  }
}