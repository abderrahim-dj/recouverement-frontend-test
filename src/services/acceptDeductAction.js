export default async function acceptDeductAction(data) {
  try {
    const url = `${import.meta.env.VITE_BACKEND_URL}deduct-amount/`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Token ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
  
    if (response.ok) {
      const result = await response.json();
      return result;
    }
    
    throw new Error('Network response was not ok');
    
  } catch (error) {
    console.error('Error in acceptDeductAction:', error);
    throw error;
    
  }
}
