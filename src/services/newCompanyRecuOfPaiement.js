export default async function newCompanyRecuOfPaiement(formData) {
  try {

    console.log('edit company recu of paiement data:', formData);
    

    const url = `${import.meta.env.VITE_BACKEND_URL}company-info/recu_of_paiement/new/`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        // z'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error('Failed to edit company recu of paiement');
    }

    return await response.json();

  } catch (error) {
    console.error('Error editing company recu of paiement:', error);
    throw error; // Re-throw the error for further handling if needed
    
  }
}