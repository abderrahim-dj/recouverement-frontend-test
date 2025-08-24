//this component is used in the FormEditCustomer.jsx file to add the actions dynamically in the form


import { Box, Select, Menu, MenuItem, Typography, TextField, Button, IconButton } from "@mui/material"
import { Controller, set, useFieldArray } from "react-hook-form"
import { useState, useEffect } from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';













export default function AddingDynamicActionsEdit ({control, customerSelectedData}) {
  

  const [initialized, setInitialized] = useState(false);


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


  // Store original values for each action type
  const [originalValues, setOriginalValues] = useState({});

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'actions'
  });


  // Update filtered action types and auto-populate actions with values > 0
  useEffect(() => {
    if (customerSelectedData) {
      const newFilteredTypes = {};
      const newOriginalValues = {};
      const initialActions = [];

      // Process each action type
      Object.keys(ALL_ACTION_TYPES).forEach(key => {
        const customerKey = ACTION_TYPE_TO_CUSTOMER_KEY[key];
        const value = parseFloat(customerSelectedData[customerKey] || "0");
        
        // Always add to filteredTypes for the dropdown
        newFilteredTypes[key] = ALL_ACTION_TYPES[key];
        
        // Store the original value
        newOriginalValues[key] = value;
        
        // If value > 0, auto-add it to the actions array
        if (value > 0) {
          initialActions.push({
            type: key,
            value: value.toString()
          });
        }
      });

      setFilteredActionTypes(newFilteredTypes);
      setOriginalValues(newOriginalValues);
      
      // Only replace the fields if we're initializing (fields is empty)
      if (initialActions.length > 0) {
        replace(initialActions);
      }
      setInitialized(true);
    }
  }, [customerSelectedData, initialized, replace]);








  // Update filtered action types when customer data changes
  // useEffect(() => {
  //   if (customerSelectedData) {
  //     const newFilteredTypes = Object.keys(ALL_ACTION_TYPES).reduce((acc, key) => {
  //       const customerKey = ACTION_TYPE_TO_CUSTOMER_KEY[key];
  //       const value = parseFloat(customerSelectedData[customerKey] || "0");
  //       if (value > 0) {
  //         acc[key] = ALL_ACTION_TYPES[key];
  //       }
  //       return acc;
  //     }, {});
  //     setFilteredActionTypes(newFilteredTypes);
  //   } else {
  //     setFilteredActionTypes({});
  //   }
  // }, [customerSelectedData]);



  // const { fields, append, remove} = useFieldArray({
  //   control,
  //   name: 'actions'
  // })


  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null)
  }


  const handleAddAction = (actionKey) => {
    // Use the original value if available, otherwise empty string
    const value = originalValues[actionKey] > 0 ? originalValues[actionKey].toString() : '';
    
    let newAction = {type: actionKey, value: value};
    if (actionKey === 'fraisService') {
      newAction.serviceType = '';
    }
    
    append(newAction);
    handleClose();
  }


  // const handleAddAction = (actionKey) => {
  //   let newAction = {type: actionKey, value: ''};
  //   if (actionKey === 'friasService') {
  //     newAction.serviceType = ''
  //   }
  //   append(newAction)
  //   handleClose();
  // }


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
              color="primary"
              sx={{
                textTransform: 'none',
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













