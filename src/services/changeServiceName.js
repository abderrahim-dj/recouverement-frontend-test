

export default async function (data) {

    try {
    const url = `${import.meta.env.VITE_BACKEND_URL}services/update-name/`;
    
    const request = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    if (request.ok) {
      const response = await request.json();
      return response;
    } else {
      throw new Error('Failed to register new user');
    }
  } catch (error) {
    throw new Error(`Error accepting registring action: ${error.message}`);
  }
  
}