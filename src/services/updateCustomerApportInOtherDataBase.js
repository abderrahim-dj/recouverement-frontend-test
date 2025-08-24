export default async function updateCustomerApportInOtherDataBase(customerID ,customerCurrentApport) {
  try {

    const url = `${import.meta.env.VITE_DATABASE_URL}update_apport/${customerID}`
    const request = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_DATABASE_TOKEN}`
      },
      body: JSON.stringify({
        'apport': customerCurrentApport
      })
    })

    if(request.ok){
      const response = await request.json()
      
      alert('Apport mis à jour avec succès dans la base de données externe')
      return response
    }
    else {
      alert('Erreur lors de la mise à jour de l\'apport dans la base de données externe')
      return null
    }
  } catch (error) {
    alert('Erreur lors de la mise à jour de l\'apport dans la base de données externe')
    console.error('Error updating apport in external database:', error)
    return null
  }
}