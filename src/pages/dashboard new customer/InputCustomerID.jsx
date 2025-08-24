import { Box, Typography } from "@mui/material"
import ComboTextInputRegisterCustomer from "../../components/UI/ComboTextInputRegisterCustomer"
import { Controller } from "react-hook-form";


export default function InputCustomerID({ control, setValue, reset, customerSelectedData, setCustomerSelectedData }) {
  return (
    <>
      {/* new input of customer id input */}
      <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
        ID
      </Typography>
      {/* customer ID */}
      <Controller
        name="user_id"
        control={control}
        rules={{ 
          required: "L'ID de client est requis",
          validate: value => 
            (value && parseInt(value) > 0) || "L'ID de client doit être positif" 
        }}
        render={({ field, fieldState }) => (
          <Box>
            <ComboTextInputRegisterCustomer 
              customerName={customerSelectedData || ''} // Changed from name={customerName}
              onCustomerSelect={(customer) => {
                console.log('cicked the oncustomerselect');


                //add previously selected taxs to the list of available taxs
                // setListOfAvailableTaxs(prev => [...prev, ...selectedTaxs]);

                // CLEAR selected taxes when selecting a new customer
                // setSelectedTaxs([]);
                
                //reset the form values
                reset();


                setValue('user_id', customer.id);
                // Update the form field value
                field.onChange(customer.id);
                console.log("Selected customer ID:", customer.id);

                //update the state of customerSelectedData
                setCustomerSelectedData(customer);

              }} 
            />
            {fieldState.error && (
              <Typography sx={{ color:'#d32f2f', fontSize: '0.75rem', ml: 1.5, mt: 0.5 }}>
                {fieldState.error.message}
              </Typography>
            )}
          </Box>
        )}
      />
    </>
  )
}