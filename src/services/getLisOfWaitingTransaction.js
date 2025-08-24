// function to get the list of transactions that are waiting for the user so he can accept thenm or reject

export default async function getListOfWaitingTransaction() {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}transaction/waiting/${localStorage.getItem('user_id')}`, {
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
    console.error('Error fetching waiting transactions:', error);
    throw error; // Re-throw the error for further handling if needed
  }
}
