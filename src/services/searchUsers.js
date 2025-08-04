export default async function searchUsers(searchTerm) {
  //const token = localStorage.getItem('access_token');
  const url = `${import.meta.env.VITE_BACKEND_URL}customers/search/?query=${searchTerm}`;

  try{
    const request = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
    }
  })
    if (request.ok){
      const responseData= await request.json();
      console.log('response search users', responseData);
      return responseData;
    }
    else{
      console.log('users search could not be fetched');
      return null;
    }
  }
  catch (error) {
    console.error('Error fetching seach users:', error);
    return null;
  }

}