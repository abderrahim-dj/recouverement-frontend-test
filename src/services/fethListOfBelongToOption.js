export default async function fetchListOfBelongToOption(){
  try {
    
    const url = `${import.meta.env.VITE_BACKEND_URL}customer-belong-to`;//&search=${searchName}
    
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
    throw new Error('Failed to fetch sbelong to list');


  } catch (error) {
    setShowModal(false);
    throw new Error(`Error fetching belong to list: ${error.message}`);
  }
}