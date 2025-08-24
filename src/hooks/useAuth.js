import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"


function useAuth () {

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function checkAuth(customFetch = null) {
      try {
      
        //send the request to check the authontication of the user
        const request = await fetch(`${import.meta.env.VITE_BACKEND_URL}check-auth/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        });

        //if status ok
        if (request.status === 200) {

          //check if the user is superuser or staff or agent
          const data = await request.json();

          //if the user is agent and try to enter the routes that are not allowed

          if (data.is_active && !data.is_staff && !data.is_superuser 
            && 
            (
              location.pathname === '/transaction-action'
              ||
              location.pathname === '/deduct-balance-action'
              ||
              location.pathname === '/deduct-balance-history'
              ||
              location.pathname === '/employee-transactions'
              ||
              location.pathname === '/manage-taxes'
              ||
              location.pathname === '/workers-create'
              ||
              location.pathname === '/workers-list'
              ||
              location.pathname === '/manage-services'
              ||
              location.pathname === '/customers-waiting-validation'
              ||
              location.pathname === '/customers-approved' 
              ||
              location.pathname === '/customers-waiting-validation'
              ||
              location.pathname === '/customers-approved'
              ||
              location.pathname === '/manage-recu-paiement'
            )
          
          ) {
            //redirect to the home page of the dashboard
            navigate('/');
          }


          //if the user is staff try to enter the routes that are not allowed

          if (data.is_active && data.is_staff && !data.is_superuser 
            && 
            (
              location.pathname === '/deduct-balance-action'
              ||
              location.pathname === '/deduct-balance-history'
              ||
              location.pathname === '/manage-taxes'
              ||
              location.pathname === '/workers-create'
              ||
              location.pathname === '/workers-list'
              ||
              location.pathname === '/employee-transactions'
              ||
              location.pathname === '/manage-services'
              ||
              location.pathname === '/customers-waiting-validation'
              ||
              location.pathname === '/customers-approved'
              ||
              location.pathname === '/customers-waiting-validation'
              ||
              location.pathname === '/customers-approved'
              ||
              location.pathname === '/manage-recu-paiement'
              // ||
              // location.pathname === '/'

              
            )
          
          ) {
            //redirect to the home page of the dashboard
            navigate('/');
          }


          //if the user admin try to enter the routes that are not allowed

          if (data.is_active && data.is_staff && data.is_superuser 
            && 
            (
              location.pathname === '/pay'
              ||
              location.pathname === '/new-customer'
              ||
              location.pathname === '/send-money'
              ||
              location.pathname === '/transaction-history'
              ||
              location.pathname === '/print-check'

            )
          
          ) {
            //redirect to the home page of the dashboard
            navigate('/');
          }





          //update the localstoreg

          localStorage.setItem('token', data.token);
          localStorage.setItem('username',data.username);
          localStorage.setItem('is_superuser',data.is_superuser);
          localStorage.setItem('is_staff',data.is_staff);
          localStorage.setItem('is_active',data.is_active);
          localStorage.setItem('user_id',data.user_id);
          localStorage.setItem('first_name',data.first_name);
          localStorage.setItem('last_name',data.last_name);

          //run the fetch request to get or post
          if (customFetch) {
            customFetch();
          }

        //if status is not ok
        }else {

          
          //remove from the local storage
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('is_superuser');
          localStorage.removeItem('is_staff');
          localStorage.removeItem('is_active');
          localStorage.removeItem('user_id');
          localStorage.removeItem('first_name');
          localStorage.removeItem('last_name');
         
          //redirect to the login page
          navigate('/login');
        }
      }
      catch(error){

        //remove from the local storage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('is_superuser');
        localStorage.removeItem('is_staff');
        localStorage.removeItem('is_active');
        localStorage.removeItem('user_id');
        localStorage.removeItem('first_name');
        localStorage.removeItem('last_name');
        //redirect to the login page
        navigate('/login');
        console.log(error);

      }
    }

    checkAuth();
  }, [navigate, location.pathname])

}

export default useAuth;