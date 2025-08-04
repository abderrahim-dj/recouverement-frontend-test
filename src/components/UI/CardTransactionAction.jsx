import { Box, Button, Typography } from "@mui/material";




/* icons */
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';


export function CardTransactionAction({ sender, reciever, amount, client, clientId, date, hanldeAccept, hanldeReject, isActionLoading}) {
  
  
  
  return (
    <Box className="bg-white rounded-lg p-6 mb-6 border-1">
      <Box className="flex items-center mb-4">
        <NotificationsOutlinedIcon fontSize="large"/>
        <h2 className="text-xl font-semibold">Transaction</h2>
      </Box>
      
      {/* the transaction information */}

      <Box className='flex flex-col gap-2'>
        <Typography> <FileUploadOutlinedIcon className="mr-2"/>Nom de l’envoyeur: {sender}</Typography>
        <Typography> <FileDownloadOutlinedIcon className="mr-2"/>Nom du destinataire: {reciever}</Typography>
        <Typography> <AccountBalanceWalletOutlinedIcon className="mr-2"/>Montant: <strong>{Number(amount)} DA</strong></Typography>
        <Typography> <PersonOutlineOutlinedIcon className="mr-2"/>Client: <strong>{client}</strong> | ID: {clientId}</Typography>
        <Typography> <InsertInvitationOutlinedIcon className="mr-2"/>Date d’envoi: {date}</Typography>
      </Box>

      {/* the buttons */}
      <Box className="flex gap-4 justify-end pt-4">
        <Button
          variant="contained"
          color="success"
          className="mr-2"
          onClick={hanldeAccept}
          sx={{ textTransform: 'none' }}
          disabled={isActionLoading}
          loading={isActionLoading}
        >Accepter</Button>

        <Button
          variant="contained"
          color="error"
          className="mr-2"
          onClick={hanldeReject}
          sx={{ textTransform: 'none' }}
          disabled={isActionLoading}
          loading={isActionLoading}
        >Rejeter</Button>
      </Box>
    </Box>
  );
}