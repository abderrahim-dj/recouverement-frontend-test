export default async function getListOfCustomerApproved({searchQuery='', pageIndex=1, pageSize=10, setShowModal}) {
  try {
    console.log('Fetching waiting transactions with search:', searchQuery, 'Page Index:', pageIndex, 'Page Size:', pageSize);
    

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}customer-approved/?search=${searchQuery}&page=${pageIndex}&page_size=${pageSize}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch waiting transactions');
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    setShowModal(true);
    console.error('Error fetching waiting transactions:', error);
    throw error; // Re-throw the error for further handling if needed
  }
}