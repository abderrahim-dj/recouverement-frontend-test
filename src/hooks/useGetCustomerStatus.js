import { useState, useEffect } from "react";
import getCustomersStatus from '../services/getCustomersStatus.js'

export default function useGetCustomerStatus() {
  const [customersData, setCusomersData] = useState()
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();







  useEffect(() => {
    let isMounted = true;
    const fetchCustomersData = async () => {
      setIsLoading(true);
      setError(null)

      try{
        const data = await getCustomersStatus();
        if (isMounted) {
          setCusomersData(data);
          setTimeout(() => {
            setIsLoading(false);

          },500)
        }
      }
      catch (error) {
        if (isMounted) {
          setError(error || 'failed to fetch data');
          setIsLoading(false);
        }
      }

    }


    fetchCustomersData();

    //cleanup function
    return () => {
      isMounted = false;
    }
  }, []);



  return{
    customersData,
    isLoading,
    error
  }

}