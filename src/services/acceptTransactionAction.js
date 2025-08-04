export default async function acceptTransactionAction(transactionId, senderId, receiverId, action, customerId) {
  try {
    const url = `${import.meta.env.VITE_BACKEND_URL}transaction/accept/${transactionId}/`;
    
    console.log(`Accepting transaction action for ID: ${transactionId}, Sender: ${senderId}, Receiver: ${receiverId}, Action: ${action}, Customer ID: ${customerId}`);
    

    const request = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        sender_id: senderId,
        receiver_id: receiverId,
        transaction_action: action, // 'Accepter' or 'Rejeter'
        customer_related: customerId
      })
    });

    if (request.ok) {
      const response = await request.json();
      return response;
    } else {
      throw new Error('Failed to accept transaction action');
    }
  } catch (error) {
    throw new Error(`Error accepting transaction action: ${error.message}`);
  }
}