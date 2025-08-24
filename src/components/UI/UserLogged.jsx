import { Box, Typography } from "@mui/joy";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

export default function UserLogged() {
  const firstName = localStorage.getItem('first_name');
  const lastName = localStorage.getItem('last_name');
  
  return (
    <Box className='absolute top-8 right-8'>
      <Box sx={
        { 
          alignSelf:'center', 
          width: 'fit-content',
          display: 'flex', 
          border: '1px solid #fff',
          gap: '1rem',
          alignItems: 'center', 
          justifyContent: 'center', 
          borderRadius:'1rem', 
          padding: '0.5rem 1rem', 
          paddingRight:'1.5rem',
          transition: 'transform 0.2s cubic-bezier(.4,2,.6,1), background-color 0.2s',
          ":hover": { 
            backgroundColor: '#e2fffe',
            border: '1px solid #00bcd4',
           }, 
          }}>
        <PersonOutlineOutlinedIcon fontSize="large" />
        <Typography fontSize={'1.5rem'} sx={{cursor:'default'}}>{firstName} {lastName}</Typography>
        <VerifiedUserOutlinedIcon color='success' fontSize="medium"/>
      </Box>
    </Box>
  )
}