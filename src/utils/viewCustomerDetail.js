//next time make it works with modal to show all the user data teh history and evrything and next make the edit work make them can edit only the prises ok not the names and other stuff jsut the prices and i need to talk to mohammed if a customer is alredy exist and he but somthing new how it should be behave is they will give him new id or i need to uspdate it in my database



export default function viewCustomerDetails(activeRow, data,showModal, modalColor, modalTitle, setShowModal, modalIcon) {

  //get customer id
  const customerID = activeRow['customer_id'];
  console.log('customerID', customerID);

  //get customer
  const customer = data.find(item => item.customer_id === customerID);
  console.log('customer found', customer);
  
  
  console.log('all data', data)
  console.log('View', activeRow)
  

}