export default async function filterCustomersByDate(data) {
  
  const url = `${import.meta.env.VITE_BACKEND_URL}customers/?customer_create_date_after=${data.customer_create_date_after}&customer_create_date_before=${data.customer_create_date_before}&customer_last_date_of_payment_after=${data.customer_last_date_of_payment_after}&customer_last_date_of_payment_before=${data.customer_last_date_of_payment_before}`

  try{
      const response = await fetch ( url,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}` 
        },
      })
    
      if(response.ok){
        const dataFiltred = await response.json()
        console.log('dataFiltred: ', dataFiltred);
        //and then disable the set is loading in the table
        return dataFiltred;
      } else{
        //and then disable the set is loading in the table
        return null;
      }


  }catch(error){
    //and then disable the set is loading in the table
    alert('server error')
    console.log(error)
  }

}