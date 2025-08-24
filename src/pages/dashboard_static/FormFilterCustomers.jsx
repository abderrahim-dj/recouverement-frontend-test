import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import { Typography } from "@mui/joy";

//function that will do the filtration of the customers by dates
import filterCustomersByDate from "../../services/filterCustomersByDate";


export default function FilterCustomerForm({sendDataToParent, waiting}) {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      customer_create_date_after: "",
      customer_create_date_before: "",
      customer_last_date_of_payment_after: "",
      customer_last_date_of_payment_before: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("Form Data:", data);

    waiting(true);

    const filteredCustomers = await filterCustomersByDate(data);

    setTimeout(() => {
      
      waiting(false);
    }, 500);

    
    sendDataToParent(filteredCustomers);
    
    //reset();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mt-10 flex gap-8"
    >
      <Typography className='self-center' level="h3">Filtrer par date</Typography>
      <Box className='flex flex-row gap-4'>
        
        <Box className='flex flex-row gap-4'>

          <Box>
            <Controller
              name="customer_create_date_after"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Enregistrer après"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              )}
            />
          </Box>

          <Box>
            <Controller
              name="customer_create_date_before"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Enregistrer avant"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              )}
            />
          </Box>
        </Box>

        <Box className='flex flex-row gap-4'>

          <Box>
            <Controller
              name="customer_last_date_of_payment_after"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Dernier paiement après"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              )}
            />
          </Box>

          <Box>
            <Controller
              name="customer_last_date_of_payment_before"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Dernier paiement avant"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              )}
            />
          </Box>
        </Box>


      </Box>
        <Box className='self-center'>
          <Button type="submit" variant="contained" fullWidth>
            Appliquer les filtres
          </Button>
        </Box>
    </Box>
  );
}
