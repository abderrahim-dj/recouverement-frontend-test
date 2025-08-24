// function to get the list of transactions that are waiting for the user so he can accept thenm or reject

export default async function getListOfCampaniesRecuOfPayment(setShowModal) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}company-info/companies-recu-of-payment/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch list of companies recu of payment');
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    setShowModal(true)
    console.error('Error fetching list of companies recu of payment:', error);
    throw error; // Re-throw the error for further handling if needed
  }
}
