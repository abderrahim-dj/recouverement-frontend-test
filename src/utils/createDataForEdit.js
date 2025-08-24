export default function createDataForEdit(formData){
  
  const {actions, ...otherProps} = formData;
  
  return{
    customer_frais_service: Number(actions.find(action => action.type === 'fraisService')?.value) || 0,
    customer_apport_personnel: Number(actions.find(action => action.type === 'apportPersonnel')?.value) || 0,
    customer_frais_virement: Number(actions.find(action => action.type === 'fraisVirement')?.value) || 0,
    customer_frais_ramassage: Number(actions.find(action => action.type === 'fraisRamassage')?.value) || 0,
    customer_frais_cash: Number(actions.find(action => action.type === 'fraisCash')?.value) || 0,
    ...otherProps,
  }
}