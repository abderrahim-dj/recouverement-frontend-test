import { Typography, Box } from "@mui/joy"
import { TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Controller } from "react-hook-form";



export default function TaxAddingForm({ nameOfTax, fieldName, control, onRemove , rules = undefined}) {
  return(
    <Box sx={{ 
      display: 'flex',
      gap: 0,
      alignItems:'end',
      justifyContent: 'center'
      }}>
    

      <Box sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        mb: 2
      }}>


        {/* Achat */}
        <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
          {nameOfTax}
        </Typography>
        
        
        <Controller
          name={fieldName}
          control={control}

          
            
          rules={
            rules 
            ? rules
            : {
              
              required: `${nameOfTax} est requis`,
              validate: {
                isNumber: (value) => 
                  !isNaN(parseFloat(value)) || `${nameOfTax} doit être un nombre`,
                isNonNegative: (value) => 
                  parseFloat(value) > 0 || `${nameOfTax} doit être supérieur à 0`,
                maxThreeDecimals: (value) =>
                  /^-?\d+(\.\d{1,3})?$/.test(value) || "Maximum 3 chiffres après la virgule",
  
              }
            }

          }
          
        
          

          render={({ field, fieldState }) => (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}>
              <TextField
                {...field}
                fullWidth
                type="number"
                label={`${nameOfTax} (DA)`}
                placeholder={`Entrez ${nameOfTax} (DA)`}
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                inputProps={{ min: 0, step: "any" }}
              />

              <Tooltip title="Delete">
                <IconButton onClick={onRemove}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        />
      </Box>


      <Box>
    
        {/* <Tooltip title="Delete" sx={{
          
        }}>
          <IconButton onClick={onRemove}>
            <DeleteIcon />
          </IconButton>
        </Tooltip> */}
        
      </Box>
    </Box>
  )
}