import { Box, Select, Menu, MenuItem, Typography, TextField, Button, IconButton } from "@mui/material"
import { Controller, useFieldArray } from "react-hook-form"
import { useState, useEffect } from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';













export default function InputCustomerActionPay ({control, customerSelectedData}) {
  



  const  ALL_ACTION_TYPES = {
  apportPersonnel: {label: 'Apport Personnel', placeholder: 'Entrez L\'apport Personnel'},
  fraisService: {label: 'Frais de service', placeholder: 'Entrez Frais de service'},
  fraisRamassage: {label: 'Frais de ramassage', placeholder: 'Entrez Le frais de ramassage'},
  fraisVirement: {label: 'Frais de virement', placeholder: 'Entrez le Frais de virement'},
  fraisCash: {label: 'Cash', placeholder: 'Entrez Le cash'}
  }


  // List of available services for the "fraisService" action
  const listOfAvailableServices = customerSelectedData
  console.log('listOfAvailableServices', listOfAvailableServices);
  

  // Map ALL_ACTION_TYPES keys to customerSelectedData keys
  const ACTION_TYPE_TO_CUSTOMER_KEY = {
    apportPersonnel: "customer_apport_personnel",
    fraisService: "customer_frais_service",
    fraisRamassage: "customer_frais_ramassage",
    fraisVirement: "customer_frais_virement",
    fraisCash: "customer_frais_cash"
  };

  // Initialize with empty object to prevent undefined errors
  const [filteredActionTypes, setFilteredActionTypes] = useState({});


  // Update filtered action types when customer data changes
  useEffect(() => {
    if (customerSelectedData) {
      const newFilteredTypes = Object.keys(ALL_ACTION_TYPES).reduce((acc, key) => {
        const customerKey = ACTION_TYPE_TO_CUSTOMER_KEY[key];
        const value = parseFloat(customerSelectedData[customerKey] || "0");
        if (value > 0) {
          acc[key] = ALL_ACTION_TYPES[key];
        }
        return acc;
      }, {});
      setFilteredActionTypes(newFilteredTypes);
    } else {
      setFilteredActionTypes({});
    }
  }, [customerSelectedData]);



  const { fields, append, remove} = useFieldArray({
    control,
    name: 'actions'
  })


  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleAddAction = (actionKey) => {
    let newAction = {type: actionKey, value: ''};
    if (actionKey === 'friasService') {
      newAction.serviceType = ''
    }
    append(newAction)
    handleClose();
  }


  //Determine which actions are available based to be added
  const addedActionTypes = fields.map(field => field.type)
  const availableActions = Object.keys(filteredActionTypes).filter(
    key => !addedActionTypes.includes(key)
  )



  
  return (
    <>
      <Box className="flex flex-col gap-4">
        {fields.map((item, index) => (
          <Box key={item.id} className=" rounded-md relative flex flex-col gap-2">
            
            

              <Typography sx={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                {filteredActionTypes[item.type].label}
              </Typography>
            
            
            

            <Box sx={{ display: 'flex'}}>
              {/* Render specific inputs based on action type */}

                {/* Default number input for other types */}
                <Controller
                  name={`actions.${index}.value`}
                  control={control}
                  rules={{
                    required: "Ce champ est requis",
                    validate: {
                        isNumber: (value) => !isNaN(parseFloat(value)) || "Doit être un nombre",
                        isNonNegative: (value) => parseFloat(value) >= 0 || "Doit être positif",
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label={`${filteredActionTypes[item.type].label} (DA)`}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      inputProps={{ min: 0, step: "any" }}
                    />
                  )}
                />
              

              <IconButton
                aria-label="delete"
                onClick={() => remove(index)}
                sx={{ }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))}

        {/* "Add Action" Button and Menu */}
        {availableActions.length > 0 && (
          <Box className="mt-2">
            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleClick}
              variant="contained"
              
              sx={{
                textTransform: 'none',
                background: '#37474f',

              
              }}
            >
              Ajouter une action
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              {availableActions.map((key) => (
                <MenuItem key={key} onClick={() => handleAddAction(key)}>
                  {filteredActionTypes[key].label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}
      </Box>

    </>
  )
}




















      // {/* part 1 */}

      // {/* frais apport personnel */}
      // <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
      //   Apport personnel
      // </Typography>
      
      // <Controller
        
      //   name={`apportPersonnel`}
      //   control={control}
      //   rules={{ 
      //     required: "Ce champ est requis",
      //     validate: {
      //       isNumber: (value) => 
      //         !isNaN(parseFloat(value)) || "L'apport personnel doit être un nombre",
      //       isNonNegative: (value) => 
      //         parseFloat(value) >= 0 || "L'apport personnel doit être positive ou nulle",
      //       maxThreeDecimals: (value) =>
      //         /^-?\d+(\.\d{1,3})?$/.test(value) || "Maximum 3 chiffres après la virgule"
      //     }
      //   }}
      //   render={({ field, fieldState }) => (
      //     <TextField
      //       {...field}
      //       fullWidth
      //       type="number"
      //       label="Apport personnel(DA)"
      //       placeholder="Entrez L'apport Personnel"
      //       variant="outlined"
      //       error={!!fieldState.error}
      //       helperText={fieldState.error?.message}
      //       inputProps={{ min: 0, step: "any" }}
      //     />
      //   )}
      // />




      // {/* part 2 */}
      // {/* Frais of services */}


      // <Box className='flex justify-between align-middle'>
      //   <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
      //     Service
      //   </Typography>
      // </Box>

      // <Box className=' flex flex-col gap-4 pt-2 mb-2'>
      //   <Box className="flex align-center gap-2">

      //     {/* the frais of service ammout input */}
      //     <Controller
            
      //       name={`fraisService`}
      //       control={control}
      //       rules={{ 
      //         required: "Ce champ est requis",
      //         validate: {
      //           isNumber: (value) => 
      //             !isNaN(parseFloat(value)) || "Frais de service doit être un nombre",
      //           isNonNegative: (value) => 
      //             parseFloat(value) >= 0 || "Frais de service doit être positive ou nulle",
      //           maxThreeDecimals: (value) =>
      //             /^-?\d+(\.\d{1,3})?$/.test(value) || "Maximum 3 chiffres après la virgule"
      //         }
      //       }}
      //       render={({ field, fieldState }) => (
      //         <TextField
      //           {...field}
      //           fullWidth
      //           type="number"
      //           label="Frais de service(DA)"
      //           placeholder="Entrez Frais de service"
      //           variant="outlined"
      //           error={!!fieldState.error}
      //           helperText={fieldState.error?.message}
      //           inputProps={{ min: 0, step: "any" }}
      //         />
      //       )}
      //     />


      //     {/* select the type of service Moto or electo */}
      //     <Controller
      //       name={`typeFraisService`}
      //       control={control}
      //       rules ={{ 
      //         required: 'selection le type de service'
      //       }}
      //       render={({ field, fieldState}) => (
      //         <Box className='flex flex-col'>
      //           <Select
      //           {...field}typeFraisService
      //           displayEmpty
      //           fullWidth
      //           error={!!fieldState.error}
      //           className='w-[5rem]'
      //           >
      //             <MenuItem value=''>Type</MenuItem>
      //             {/* 
      //             <MenuItem value='moto'>Moto</MenuItem>
      //             <MenuItem value='electro'>Electro</MenuItem> 
      //             */}
      //             {listOfAvailableServices.map((service) => {
      //               return (
      //                 <MenuItem key={service.id} value={service.service_name}>
      //                   {service.service_name}
      //                 </MenuItem>
      //               )
      //             })}

      //           </Select>
      //           {fieldState.error && (
      //             <Typography sx={{ color:'#d32f2f', fontSize: '0.75rem', ml: 1.5, mt: 0.5 }}>
      //               {fieldState.error.message}
      //             </Typography>
      //           )}
      //         </Box>
      //       )}
      //     >
            
      //     </Controller>
      //   </Box>
      // </Box>





      // {/* part 3 */}
      // <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
      //   Frais de ramassage
      // </Typography>
      
      // <Controller
        
      //   name={`fraisRamassage`}
      //   control={control}
      //   rules={{ 
      //     required: "Ce champ est requis",
      //     validate: {
      //       isNumber: (value) => 
      //         !isNaN(parseFloat(value)) || "doit être un nombre",
      //       isNonNegative: (value) => 
      //         parseFloat(value) >= 0 || "doit être positive ou nulle",
      //       maxThreeDecimals: (value) =>
      //         /^-?\d+(\.\d{1,3})?$/.test(value) || "Maximum 3 chiffres après la virgule"
      //     }
      //   }}
      //   render={({ field, fieldState }) => (
      //     <TextField
      //       {...field}
      //       fullWidth
      //       type="number"
      //       label="Frais de ramassage(DA)"
      //       placeholder="Entrez Le frais de ramassage"
      //       variant="outlined"
      //       error={!!fieldState.error}
      //       helperText={fieldState.error?.message}
      //       inputProps={{ min: 0, step: "any" }}
      //     />
      //   )}
      // />




      // {/* part 4 */}
      // <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
      //   Frais de virement
      // </Typography>
      
      // <Controller
        
      //   name={`fraisVirement`}
      //   control={control}
      //   rules={{ 
      //     required: "Ce champ est requis",
      //     validate: {
      //       isNumber: (value) => 
      //         !isNaN(parseFloat(value)) || "doit être un nombre",
      //       isNonNegative: (value) => 
      //         parseFloat(value) >= 0 || "doit être positive ou nulle",
      //       maxThreeDecimals: (value) =>
      //         /^-?\d+(\.\d{1,3})?$/.test(value) || "Maximum 3 chiffres après la virgule"
      //     }
      //   }}
      //   render={({ field, fieldState }) => (
      //     <TextField
      //       {...field}
      //       fullWidth
      //       type="number"
      //       label="Frais de virement(DA)"
      //       placeholder="Entrez le Frais de virement"
      //       variant="outlined"
      //       error={!!fieldState.error}
      //       helperText={fieldState.error?.message}
      //       inputProps={{ min: 0, step: "any" }}
      //     />
      //   )}
      // />



      // {/* part 5 */}
      // <Typography sx={{fontSize: '1.3rem', fontWeight: 'bold'}}>
      //   Cash
      // </Typography>
      
      // <Controller
        
      //   name={`fraisCash`}
      //   control={control}
      //   rules={{ 
      //     required: "Ce champ est requis",
      //     validate: {
      //       isNumber: (value) => 
      //         !isNaN(parseFloat(value)) || "doit être un nombre",
      //       isNonNegative: (value) => 
      //         parseFloat(value) >= 0 || "doit être positive ou nulle",
      //       maxThreeDecimals: (value) =>
      //         /^-?\d+(\.\d{1,3})?$/.test(value) || "Maximum 3 chiffres après la virgule"
      //     }
      //   }}
      //   render={({ field, fieldState }) => (
      //     <TextField
      //       {...field}
      //       fullWidth
      //       type="number"
      //       label="Apport Personnel(DA)"
      //       placeholder="Entrez Le cash"
      //       variant="outlined"
      //       error={!!fieldState.error}
      //       helperText={fieldState.error?.message}
      //       inputProps={{ min: 0, step: "any" }}
      //     />
      //   )}
      // />