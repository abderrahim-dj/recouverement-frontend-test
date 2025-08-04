export default async function searchUserForSendingMoney(searchTerm) {
  const url = `${import.meta.env.VITE_BACKEND_URL}search-user/?search=${searchTerm}`;

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