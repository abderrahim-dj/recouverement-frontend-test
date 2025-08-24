import * as React from 'react';
import Button from '@mui/material/Button';
import ListSubheader from '@mui/material/ListSubheader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function PlusButtonForAddingTax({ availableTaxs, onTaxSelect }) {
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (tax) => {
    onTaxSelect(tax);
    handleClose()
  }




  return (
    <div>
      <Button
        variant="contained"
        id="basic-button"
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          textTransform: 'none',
          background: '#37474f'
        }}
        startIcon={<AddCircleOutlineIcon />}
      >
         Ajouter une taxe
      </Button>
      <Menu
        id="grouped-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        {/* <ListSubheader>Taxe</ListSubheader> */}

        {availableTaxs.map((tax) => {
          return (
            <MenuItem 
              key={tax.id} 
              onClick={() => handleMenuItemClick(tax)}
            >
              {tax.tax_name}
            </MenuItem>
          )
        }
        )}

        {/* if the list is empty display this message */}
        {availableTaxs.length === 0 && (
          <MenuItem disabled>
            Aucune taxe disponible
          </MenuItem>
        )}

        {/* Uncomment the following lines if you want to add more categories */}


        
        {/* 
        <ListSubheader>Category 2</ListSubheader>
        <MenuItem onClick={handleClose}>Option 3</MenuItem>
        <MenuItem onClick={handleClose}>Option 4</MenuItem>
        */}
      </Menu>
    </div>
  );
}
