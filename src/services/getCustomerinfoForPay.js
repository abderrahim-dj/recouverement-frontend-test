export default async function getCustomerInfoForPay (data) {

  const url = `${import.meta.env.VITE_BACKEND_URL}${data.user_id}`
  const request = await fetch (url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${localStorage.getItem('token')}`
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
    alert('error while fetching data or data not exist')

    return;
  }
  

}
