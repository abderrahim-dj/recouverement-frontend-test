export default async function filterHistorySendingMoneyAll({ pageIndex=1, pageSize=10, searchName='', hide_amount_equal_zero='', user_id='', setShowModal}){
  try {
    
    const url = `${import.meta.env.VITE_BACKEND_URL}user-collect-money/?user_id=${localStorage.getItem('user_id')}&page=${pageIndex}&page_size=${pageSize}&search=${searchName}&hide_amount_equal_zero=${hide_amount_equal_zero}&user_id=${user_id}`;//&search=${searchName}
    
    const request = await fetch(url,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      }
    })

    if(request.ok){
      const response = await request.json();
      return response;
    }
    throw new Error('Failed to fetch sending money history');


  } catch (error) {
    setShowModal(true);
    throw new Error(`Error fetching sending money history: ${error.message}`);
  }
}