export default function createDataForPaying(fromData) {
  const data = new FormData();
  

  //set the list of what paid
  // const whatPay = [
  //   Number(fromData.amount_paid_apport_personnelle) !== 0 ? "Apport personnel" : null,
  //   Number(fromData.amount_paid_service) !== 0 ? "Service" : null
  // ].filter(Boolean);

  //data.append("what_pay", JSON.stringify(whatPay));
  //whatPay.forEach(item => data.append("what_pay", item));

  //some other data
  data.append("customer", fromData.user_id);
  //data.append("collected_by",`${localStorage.getItem('first_name')} ${localStorage.getItem('last_name')} | ${localStorage.getItem('user_id')}`);
  data.append("receipt_img", fromData.receipt_img);
  data.append("pay_method", fromData.pay_method);
  data.append("actions", JSON.stringify(fromData.actions || []));

  //Details of the payment
  // data.append("pay_achat", fromData.amount_paid_achat);
  // data.append("pay_annulation", fromData.amount_paid_annulation);


  // add the dynamic taxes

  // List of static fields already appended
  const staticFields = [
    "user_id",
    "receipt_img",
    "pay_method",
    'actions'
  ];
  
  
  // Add the dynamic taxes
  Object.entries(fromData)
    .filter(([key]) => !staticFields.includes(key))
    .forEach(([key, value]) => {
      data.append(key, value);
    });


  for (let [key, value] of data.entries()) {
    console.log(`${key}:`, value);
  }

  console.log('data for send the payment history:', data);
  
  

  return data;
}
