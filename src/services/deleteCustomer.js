export default async function deleteCustomer(rowData, data, setData) {
  try{

    console.log('Delete', rowData)
    const customerID = rowData['customer_id'];
    
    console.log('customerID', customerID);

    const url = `${import.meta.env.VITE_BACKEND_URL}delete/${customerID}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Token ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      //i think i should add the modal as a message
      alert('Customer deleted successfully');
      
      //remove the user form the table
      setData(data.filter(item => item.customer_id !== customerID))

      
      }else{
        //i think i should add the modal as a message
        alert('Failed to delete customer');
      
      }
  }catch(err) {
    console.log(err);
    
  }
}