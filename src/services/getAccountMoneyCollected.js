import { useState, useEffect } from "react";

export default  function useAccountMoneyCollected(id) {
  
  const [UsersData, setUserData] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}getaccountmoneycollected/${id}`;
        const request = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Token ${localStorage.getItem('token')}`
          },
        });

        if (request.ok) {
          const data = await request.json();
          setUserData(data);
        }
        else {
          setError('Error fetching data from API account money collected');
        }

      } catch (error) {
        setError(error[0] || 'Error fetching data from API account money collected');
      }
      finally {
        setTimeout(()=>{setIsLoading(false)},500);
      }
    };
    fetchData()
  }, [id])

    return {
      UsersData,
      isLoading,
      error
    }
  
}