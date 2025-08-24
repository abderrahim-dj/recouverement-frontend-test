export default async function filterEmployeeTransaction(pageIndex=1, pageSize=10, searchName='', setShowModal) {
try {
    const url = `${import.meta.env.VITE_BACKEND_URL}employee-transaction/?user_id=${localStorage.getItem('user_id')}&page=${pageIndex}&page_size=${pageSize}&search=${searchName}`;//&search=${searchName}


    console.log('pageindex:', pageIndex);
    console.log('pageSize:', pageSize);
    console.log('searchName:', searchName);
    

    console.log('Fetching transaction action history from:', url);
    
    // Fetch the data from the API
    const request = await fetch( url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      }
    );

    if(request.ok){
      const response = await request.json();
      return response;
    }

    throw new Error('Failed to fetch sending money history');
  
  } catch (error) {
    setShowModal(true)
    console.error('Error fetching transaction action history:', error);
  }

}