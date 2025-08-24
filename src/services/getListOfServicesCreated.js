// function to get the list of transactions that are waiting for the user so he can accept thenm or reject

export default async function getListOfWaitingTransaction(searchQuery='', pageIndex=1, pageSize=10, setShowModal) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}services/list/?search=${searchQuery}&page=${pageIndex}&page_size=${pageSize}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch created services');
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    setShowModal(true)
    console.error('Error fetching created services:', error);
    throw error; // Re-throw the error for further handling if needed
  }
}
