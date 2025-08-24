//function used in the customer payment form to check if the customer has a negative amount after deductions of any one of what he pays

export default function hasNegativeAfterDeduction(customerInfoData, formData, selectedTaxs) {
  if (!customerInfoData || !formData) return false;


  console.log('hasnegativeAfterDeduction Form data:', formData);
  console.log('hasnegativeAfterDeduction Customer Info Data:', customerInfoData);
  
  
  // Check apport personnel
  const newApport = Number(customerInfoData.customer.customer_apport_personnel) - Number(formData.actions.find(action => action.type === 'apportPersonnel')?.value || 0);
  if (newApport < 0) return true;
  
  // Check service
  const newService = Number(customerInfoData.customer.customer_frais_service) - Number(formData.actions.find(action => action.type === 'fraisService')?.value || 0);
  if (newService < 0) return true;

  // Check ramassage
  const newRamassage = Number(customerInfoData.customer.customer_frais_ramassage) - Number(formData.actions.find(action => action.type === 'fraisRamassage')?.value || 0);
  if (newRamassage < 0) return true;

  // Check virement
  const newVirement = Number(customerInfoData.customer.customer_frais_virement) - Number(formData.actions.find(action => action.type === 'fraisVirement')?.value || 0);
  if (newVirement < 0) return true;

  // Check cash
  const newCash = Number(customerInfoData.customer.customer_frais_cash) - Number(formData.actions.find(action => action.type === 'fraisCash')?.value || 0);
  if (newCash < 0) return true;


  // Check dynamic taxes
  


  const taxTrackingSet = customerInfoData.customertaxtracking_set;

  if (Array.isArray(taxTrackingSet)) {
    for (const tax of selectedTaxs) {
      const taxId = tax.id;
      const original = Number(
        taxTrackingSet.find(t => t.tax === taxId)?.amount || 0
      );
      const paid = Number(formData[taxId] || 0);
      if (original - paid < 0) return true;
    }
  }



  // for (const tax of selectedTaxs) {
  //   const taxId = tax.id;
  //   const original = Number(
  //     customerInfoData.customer.customertaxtracking_set.find(t => t.tax === taxId)?.amount || 0
  //   );
  //   const paid = Number(formData[taxId] || 0);
  //   if (original - paid < 0) return true;
  // }

  return false;
}