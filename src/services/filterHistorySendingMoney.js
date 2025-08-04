export default async function filterHistorySendingMoney({ pageIndex=1, pageSize=10, searchName='', setShowModal}){
  try {
    
    const url = `${import.meta.env.VITE_BACKEND_URL}transaction-history/?user_id=${localStorage.getItem('user_id')}&page=${pageIndex}&page_size=${pageSize}&search=${searchName}`;//&search=${searchName}
    
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