export default async function getCustomersStatus() {
  try{
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}customers-status`, {
      method:'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':`Token ${localStorage.getItem('token')}`
    }
  })

    if(response.ok){
      const data = await response.json();
      console.log('Customers status data:', data);
      return data;
    }
    else {
      console.error('Error fetching customers status:', response.statusText);
      throw new Error('Failed to fetch customers status');
    }

  }catch (error) {
    console.error('Error fetching customers status:', error);
    throw error;
  }
}