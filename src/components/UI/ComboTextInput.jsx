import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState, useRef, useEffect } from 'react';
import searchUsers from '../../services/searchUsers';
import CircularProgress from '@mui/material/CircularProgress';

export default function ComboBox({ onCustomerSelect, customerName }) {
  const [results, setResults] = useState([]);
  // Use the customerName prop to initialize the inputValue directly
  const [inputValue, setInputValue] = useState(customerName || '');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(null);

  // Update input value when customerName prop changes
  useEffect(() => {
    if (customerName !== inputValue) {
      setInputValue(customerName || '');
      setSelectedCustomer(null); // Reset selected customer when input value changes
    }
  }, [customerName]);



  // When a customer is selected, display full label and propagate ID
  useEffect(() => {
    if (selectedCustomer) {
      
      //log the selected customer 
      console.log('Selected customer:', selectedCustomer);
      
      
      // Set input value for display purposes
      setInputValue(`${selectedCustomer.customer_firstname} ${selectedCustomer.customer_lastname} | ${selectedCustomer.customer_id}`);
      
      // Notify parent component with just the ID as a string
      if (onCustomerSelect) {
        onCustomerSelect(selectedCustomer);
      }
    }
  }, [selectedCustomer, onCustomerSelect]);

  // Handle typing vs. selection: only search on user typing
  const handleInputChange = (event, newValue, reason) => {
    if (reason !== 'input') return;
    setInputValue(newValue);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (newValue && newValue.trim()) {
      setIsLoading(true);
      timeoutRef.current = setTimeout(async () => {
        try {
          const searchResult = await searchUsers(newValue);
          setResults(searchResult || []);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 500);
    } else {
      setResults([]);
    }
  };

  const handleSelectionChange = (event, newValue) => {
    setSelectedCustomer(newValue);
  };

  const getOptionLabel = (option) =>
    option && typeof option === 'object'
      ? `${option.customer_firstname} ${option.customer_lastname} | ${option.customer_id}`
      : '';

  return (
    <Autocomplete
      disablePortal
      options={results}
      value={selectedCustomer}
      inputValue={inputValue} 
      onInputChange={handleInputChange}
      onChange={handleSelectionChange}
      getOptionLabel={getOptionLabel}
      filterOptions={(x) => x}
      loading={isLoading}
      sx={{ width: '100%' }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Rechercher un client"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}