export default async function getCustomerInfo (id) {
  
  const url = `${import.meta.env.VITE_DATABASE_URL}info/${id}`;
  
  console.log(url);
  
  const request = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_DATABASE_TOKEN}`
    },
  })

  if (request.ok) {
    console.log('data fetched successfully');
    const responseData = await request.json()
    console.log(responseData)
    return responseData;
  }

  else {
    console.log('error while fetching data or data not exist')

    return null;
  }
  

}