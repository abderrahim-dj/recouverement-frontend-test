

export default async function (data) {

    try {
    const url = `${import.meta.env.VITE_BACKEND_URL}taxes/list-all/`;
    
    const request = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      },
    });

    if (request.ok) {
      const response = await request.json();
      return response;
    } else {
      throw new Error('Failed to get all list of taxs');
    }
  } catch (error) {
    throw new Error(`Error get all list of taxs: ${error.message}`);
  }
  
}