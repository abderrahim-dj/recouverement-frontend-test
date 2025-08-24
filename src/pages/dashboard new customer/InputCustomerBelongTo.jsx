import { Box, Select, MenuItem, Typography, TextField } from "@mui/material"
import { Controller, useWatch } from "react-hook-form"



export default function InputCustomerBelongTo ({listOfAvailableBelongTo, control}) {
  
  const belongToValue = useWatch({
    control,
    name: 'customer_belong_to'
  })

  
  return(
    <>
      <Controller
        name={'customer_belong_to'}
        control={control}
        defaultValue={''}
        rules={{
          required: 'La sélection est requise',
        }}
        render={({ field, fieldState}) => (
          <Box className='flex flex-col gap-2'>

            <Typography
              sx={{fontSize: '1.3rem', fontWeight: 'bold'}}
            >
              Rattaché à
            </Typography>

            <Select
              {...field}
              //onChange={(event, newValue) => field.onChange(newValue)}
              displayEmpty
              error={!!fieldState.error}
              className='w-[5rem]'
              fullWidth
            >
              <MenuItem value=''>Type</MenuItem>

              
              {listOfAvailableBelongTo && listOfAvailableBelongTo.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                )
              })}
              
              {/* <MenuItem value='autre'>autre</MenuItem> */}
              

            </Select>
            {fieldState.error && (
              <Typography sx={{color:'#d32f2f', fontSize: '0.75rem', ml: 1.5, mt: 0.5 }}>
                {fieldState.error.message}
              </Typography>
            )}




{/* 
            {belongToValue ==='autre' && (
              <Controller
                name='customer_belong_to_name_autre'
                control={control}
                rules={{
                  required: 'Veuillez préciser la valeur'
                }}
                render={({ field, fieldState}) => (
                  <TextField
                   {...field}
                   label='Nom du rattachement'
                   variant='outlined'
                   placeholder="Préciser le rattaché à"
                   fullWidth
                   error={!!fieldState.error}
                   helperText={fieldState.error ? fieldState.error.message : ''}
                   sx={{mt: 1}}
                  />
                )}
              />
            )} */}


          </Box>
        )}
      >
        
      </Controller>
    </>
  )
}