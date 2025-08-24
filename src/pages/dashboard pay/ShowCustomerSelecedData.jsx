import { Box, Paper, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import React from "react";


export default function ShowCustomerSelectedData({ 
  customerSelectedData,
  isMobile
}) {
  return (
    <>
      <Box >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, minWidth: '100%', mx: isMobile ? 0 : '3rem', my:isMobile ? 0 :1 }}>
          <Typography sx={{fontWeight:'bold', fontSize:'1.3rem'}}>
            Informations client:
          </Typography>

          <List >
            <ListItem sx={{padding:0}}>
              <ListItemText
                primary="Nom complet de client"
                secondary={`${customerSelectedData.customer_firstname } ${customerSelectedData.customer_lastname }`}
              />
            </ListItem>
            <Divider />

            <ListItem sx={{padding:0}}>
              <ListItemText
                primary="Client de"
                secondary={`${customerSelectedData.customer_belong_to }`}
              />
            </ListItem>
            <Divider />




            {/* total of tax amount */}
            <ListItem sx={{padding:0}}>
              <ListItemText
                primary='Total des frais:'
                secondary={
                  `
                    ${customerSelectedData.customertaxtracking_set.reduce((acc, item) => acc + Number(item.amount), 0) + Number(customerSelectedData.customer_frais_service) + Number(customerSelectedData.customer_apport_personnel)}
                    DA
                  `
                  
                }
                
              />
            </ListItem>
            <Divider />


            {/* show the customer apport personnle tax to status */}
            
            {Number(customerSelectedData.customer_apport_personnel) > 0 && (
              <>
                <ListItem sx={{padding:0}}>
                  <ListItemText
                    primary={`Apport personnel:`}
                    secondary={`${Number(customerSelectedData.customer_apport_personnel)} DA`}
                  />
                </ListItem>
                <Divider />
              </>
            )}

            {/* show the customer service tax to status */}
            {Number(customerSelectedData.customer_frais_service) > 0 && (
              <>
                <ListItem sx={{padding:0}}>
                  <ListItemText
                    primary={`Service (${customerSelectedData.customer_service_name}):`}
                    secondary={`${Number(customerSelectedData.customer_frais_service) } DA`}
                  />
                </ListItem>
                <Divider />
              </>
            )}

            {/* show the customer cash tax to status */}
            {Number(customerSelectedData.customer_frais_cash) > 0 && (
              <>
                <ListItem sx={{padding:0}}>
                  <ListItemText
                    primary={`Cash:`}
                    secondary={`${Number(customerSelectedData.customer_frais_cash) } DA`}
                  />
                </ListItem>
                <Divider />
              </>
            )}


            {/* show the customer virement tax to status */}
            {Number(customerSelectedData.customer_frais_virement) > 0 && (
              <>
                <ListItem sx={{padding:0}}>
                  <ListItemText
                    primary={`Virement:`}
                    secondary={`${Number(customerSelectedData.customer_frais_virement) } DA`}
                  />
                </ListItem>
                <Divider />
              </>
            )}


            {/* show the customer ramassage tax to status */}
            {Number(customerSelectedData.customer_frais_ramassage) > 0 && (
              <>
                <ListItem sx={{padding:0}}>
                  <ListItemText
                    primary={`Ramassage:`}
                    secondary={`${Number(customerSelectedData.customer_frais_ramassage) } DA`}
                  />
                </ListItem>
                <Divider />
              </>
            )}


            



          {/* show the rest of the custome taxes */}
          {
            customerSelectedData.customertaxtracking_set.map((tax) => {
              return (
                <React.Fragment key={tax.tax}>
                  <ListItem sx={{padding:0}}>
                    <ListItemText
                      primary={`${tax.tax_name}:`}
                      secondary={`${Number(tax.amount) } DA`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              )
            })
          }

        </List>
      </Paper>
    </Box>
  </>
  );
}