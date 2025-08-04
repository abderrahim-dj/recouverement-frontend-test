export default async function login(data) {
  
  try {
    const url=`${import.meta.env.VITE_BACKEND_URL}login/`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if(response.ok) {
      const responseData = await response.json()

      localStorage.setItem('token', responseData.token)
      localStorage.setItem('username', responseData.username)
      localStorage.setItem('user_id', responseData.user_id)
      localStorage.setItem('is_active', responseData.is_active)
      localStorage.setItem('is_staff', responseData.is_staff)
      localStorage.setItem('is_superuser', responseData.is_superuser)
      localStorage.setItem('first_name', responseData.first_name)
      localStorage.setItem('last_name', responseData.last_name)


      /*       
      console.log('type of token', typeof localStorage.getItem('token'));
      console.log('type of username', typeof localStorage.getItem('username'));
      console.log('type of user_id', typeof localStorage.getItem('user_id'));
      console.log('type of is_active', typeof localStorage.getItem('is_active'));
      console.log('type of is_staff', typeof localStorage.getItem('is_staff'));
      console.log('type of is_superuser', typeof localStorage.getItem('is_superuser')); 
      */
      

      return responseData;

    }
  }catch(error) {
    console.log(error)
  }
}