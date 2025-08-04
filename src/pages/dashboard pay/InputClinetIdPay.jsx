import { Typography, Box } from "@mui/material";
import { Controller } from "react-hook-form";
import ComboTextInput from "../../components/UI/ComboTextInput";

export default function InputClientIdPay({ 
  control, 
  reset, 
  setSelectedTaxs, 
  setImg, 
  setFileError, 
  setCustomerName, 
  setCustomerSelectedData, 
  setAmmountLeft, 
  setFormData, 
  setCustomerInfoData, 
  customerName 
}) {

  return (
    <>
      {/* select the client who will pay */}
      <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
        Client
      </Typography>

      <Controller
        name="user_id"
        control={control}
        rules={{ 
          required: "L'ID utilisateur est requis",
          validate: value => 
            (value && parseInt(value) > 0) || "L'ID utilisateur doit être positif" 
        }}
        render={({ field, fieldState }) => (
          <Box>
            <ComboTextInput 
              customerName={customerName} // Changed from name={customerName}
              onCustomerSelect={(customer) => {

              // Reset the form and related states
              reset({
                user_id: customer.customer_id,
                pay_method: '',
                receipt_img: null
              });
              setSelectedTaxs([]); // Clear selected taxes
              setImg(null);        // Clear image preview
              setFileError('');
              setCustomerName(customer.customer_firstname + ' ' + customer.customer_lastname);
              setCustomerSelectedData(customer);
              setAmmountLeft(null);
              setFormData(null);
              setCustomerInfoData(null);



                // Update the form field value
                field.onChange(customer.customer_id);
                console.log("Selected customer ID:", customer.customer_id);

                //update the state of customerSelectedData
                setCustomerSelectedData(customer);
                //reset the fields of the form after selecting a nother customer
                
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