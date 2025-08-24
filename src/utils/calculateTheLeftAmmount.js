export default function calculateTheLeftAmmount (formData, customerData) {
  
  
  console.log('formData', formData);
  console.log('customerData for calcualte left amount', customerData);
  
  
  
  
  //customer data Taxes section
  // Ensure dynamicTaxes is always an array
  const dynamicTaxes = Array.isArray(customerData.customertaxtracking_set)
    ? customerData.customertaxtracking_set
    : [];


    console.log('dynamicTaxes', dynamicTaxes);
    


  // Calculate the sum of all dynamic tax amounts
  const dynamicTaxesTotal = dynamicTaxes.reduce(
    (sum, tax) => sum + (Number(tax.amount) || 0),
    0
  );

  console.log('dynamicTaxesTotal', dynamicTaxesTotal);
  

  //initial amount
  let leftAmmount = 
    Number(customerData.customer.customer_frais_cash) + 
    Number(customerData.customer.customer_frais_ramassage) + 
    Number(customerData.customer.customer_frais_virement) + 
    Number(customerData.customer.customer_apport_personnel) +
    Number(customerData.customer.customer_frais_service) +
    dynamicTaxesTotal ;

  console.log('initial left ammount', leftAmmount);










  //costumer paid section

  //customer dynamic taxes payed
  const paidDynamicTaxes = Object.entries(formData)
    .filter(
      ([key]) =>
        ![
          'pay_method',
          'receipt_img',
          'user_id',
          'actions',

        ].includes(key)
    )
    .reduce((sum, [, value]) => sum + (Number(value) || 0), 0);


  console.log('paid dynamic taxes', paidDynamicTaxes);

  

  let amount_paid_service = 0;

  if (formData.actions.find(value => value.type === 'fraisService')?.value) {
    amount_paid_service = Number(formData.actions.find(value => value.type === 'fraisService')?.value);
  }



  let amount_paid_apport_personnel = 0;

  if (formData.actions.find(value => value.type === 'apportPersonnel')?.value) {
    amount_paid_apport_personnel = Number(formData.actions.find(value => value.type === 'apportPersonnel')?.value);
  }



  let amount_paid_ramassage = Number(formData.actions.find(value => value.type === 'fraisRamassage')?.value || 0);
  if (formData.actions.find(value => value.type === 'fraisRamassage')?.value) {
    amount_paid_ramassage = Number(formData.actions.find(value => value.type === 'fraisRamassage')?.value);
  } 
  
  
  let amount_paid_verment = Number(formData.actions.find(value => value.type === 'fraisVirement')?.value || 0);
  if (formData.actions.find(value => value.type === 'fraisVirement')?.value) {
    amount_paid_verment = Number(formData.actions.find(value => value.type === 'fraisVirement')?.value);
  } 
  
  
  let amount_paid_cash = Number(formData.actions.find(value => value.type === 'fraisCash')?.value || 0);

  if (formData.actions.find(value => value.type === 'fraisCash')?.value) {
    amount_paid_cash = Number(formData.actions.find(value => value.type === 'fraisCash')?.value);
  }


  //deducting the paid amount of service if he is greater than 0
  if(amount_paid_service > 0){
    leftAmmount -= Number(amount_paid_service);
  }

  console.log('left ammount after deducting paid service', leftAmmount);
  

  //deducting the paid apport personnel if he is greater than 0
  if(amount_paid_apport_personnel > 0) {
    leftAmmount -= Number(amount_paid_apport_personnel);
  }

  console.log('left ammount after deducting paid apport personnel', leftAmmount);
  


  //deducting the paid ramassage if he is greater than 0
  if(amount_paid_ramassage > 0) {
    leftAmmount -= Number(amount_paid_ramassage);
  }

  console.log('left ammount after deducting paid ramassage', leftAmmount);
  

  //deducting the paid virement if he is greater than 0
  if(amount_paid_verment > 0) {
    leftAmmount -= Number(amount_paid_verment);
  }

  console.log('left ammount after deducting paid virement', leftAmmount);
  

  //deducting the paid cash if he is greater than 0
  if(amount_paid_cash > 0) {
    leftAmmount -= Number(amount_paid_cash);
  }

  console.log('left ammount after deducting paid cash', leftAmmount);
  





  //deducting the paid dynamic taxes
  if(paidDynamicTaxes > 0) {
    leftAmmount -= Number(paidDynamicTaxes);
  }


  console.log('left ammount after deducting paid dynamic taxes', leftAmmount);
  

  console.log('Final leftAmmount:', leftAmmount);





  console.log('left ammount', leftAmmount);
  

  return leftAmmount.toFixed(3);
}