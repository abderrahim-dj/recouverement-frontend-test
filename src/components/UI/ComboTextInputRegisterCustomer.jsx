import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState, useRef, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import getCustomerInfo from '../../services/getCustomerInfo';

export default function ComboBox({ onCustomerSelect, customerName }) {
  const [results, setResults] = useState([]);
  const [inputValue, setInputValue] = useState(customerName || '');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(null);



  useEffect(() => {
    if (customerName !== inputValue && customerName !== '') {

      console.log('customerName : ', customerName);
      

      setInputValue(`${customerName.nom} ${customerName.prenom} | ${customerName.id}` || '');
      setSelectedCustomer(null);
    } else {
      setInputValue('')
      setSelectedCustomer(null)
    }
  }, [customerName]);



  useEffect(() => {
    if (selectedCustomer) {
      console.log('Selected customer:', selectedCustomer);
      setInputValue(
        `${selectedCustomer.nom} ${selectedCustomer.prenom} | ${selectedCustomer.id}`
      );
      if (onCustomerSelect) {
        onCustomerSelect(selectedCustomer);
      }
    }
  }, [selectedCustomer, onCustomerSelect]);



  const handleInputChange = (event, newValue, reason) => {
    if (reason !== 'input') return;
    setInputValue(newValue);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (newValue && newValue.trim()) {
      setIsLoading(true);
      timeoutRef.current = setTimeout(async () => {
        try {
          const searchResult = await getCustomerInfo(newValue);
          setResults([searchResult.data] || []);
          // Immediately select the only result if there's exactly one
          if (searchResult && searchResult.length === 1) {
            setSelectedCustomer(searchResult.data);
          }
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

  const getOptionLabesetTimel = (option) =>
    option && typeof option === 'object'
      ? `${option.nom} ${option.prenom} | ${option.id}`
      : '';

  return (
    <Autocomplete
      disablePortal
      options={results}
      value={selectedCustomer}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={(event, value) => setSelectedCustomer(value)}
      getOptionLabel={getOptionLabesetTimel}
      filterOptions={(x) => x} // don't filter out the one item
      loading={isLoading}
      disableClearable
      openOnFocus={false}
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
