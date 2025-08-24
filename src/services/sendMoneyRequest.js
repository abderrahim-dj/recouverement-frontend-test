export default async function sendMoneyRequest(data) {
  try {
    const url = `${import.meta.env.VITE_BACKEND_URL}send-money-request/`;
    const request = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Token ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    if (request.ok) {
      const response = await request.json();
      return response;
    } else {
      throw new Error('Error sending money request');
    }
  } catch (error) {
    console.error('Error in sendMoneyRequest:', error);
    throw error;
  }
}