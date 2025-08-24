import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState, useRef, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import searchUserForSendingMoney from '../../services/searchUserForSendingMoney';

export default function ComboBox({ onCustomerSelect, customerName }) {
  const [results, setResults] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  //const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (customerName && typeof customerName === 'object') {
      setInputValue(
        `${customerName.first_name} ${customerName.last_name}`
      );
      setSelectedUser(customerName);
    } else {
      setInputValue('');
      setSelectedUser(null);
    }
  }, [customerName]);

  useEffect(() => {
    if (selectedUser) {
      setInputValue(
        `${selectedUser.first_name} ${selectedUser.last_name}`
      );
      if (onCustomerSelect) {
        onCustomerSelect(selectedUser);
      }
    }
  }, [selectedUser, onCustomerSelect]);

  const handleInputChange = (event, newValue, reason) => {
    if (reason !== 'input') return;
    setInputValue(newValue);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (newValue && newValue.trim()) {
      setIsLoading(true);
      timeoutRef.current = setTimeout(async () => {
        try {
          const searchResult = await searchUserForSendingMoney(newValue);
          setResults(Array.isArray(searchResult) ? searchResult : []);
          // Immediately select the only result if there's exactly one
          if (Array.isArray(searchResult) && searchResult.length === 1) {
            setSelectedUser(searchResult[0]);
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

  const getOptionLabel = (option) =>
    option && typeof option === 'object'
      ? `${option.first_name} ${option.last_name}`
      : '';

  return (
    <Autocomplete
      disablePortal
      options={results}
      value={selectedUser}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={(event, value) => setSelectedUser(value)}
      getOptionLabel={getOptionLabel}
      filterOptions={(x) => x}
      loading={isLoading}
      disableClearable
      openOnFocus={false}
      sx={{ width: '100%' }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Rechercher le destinataire"
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