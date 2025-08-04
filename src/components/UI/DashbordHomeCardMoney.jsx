import { Box, Typography, CircularProgress  } from "@mui/joy"

import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import MovingOutlinedIcon from '@mui/icons-material/MovingOutlined';

import useIsMobile from "../../hooks/useIsMobile";


export default function DashbordHomeCardMoney ({title, amount, isLoading}) {
  
  const isMobile = useIsMobile();
  
  return (
    
    //main box
    <Box sx={{
      //flex:1
      //paddingX:'5rem'
      padding:'2rem',
      borderRadius:'25px',
      border:'solid 1px #D4D4D4',
      boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.2)',
      

    }}>
      
      {/* top section */}

      <Box sx={{
        display:'flex',
        justifyContent: isMobile ? 'space-between' : 'space-around',
        gap: isMobile ? 0 : '3rem',
        paddingX: isMobile ? '0rem' : '0',
      }}>
        <Typography sx={{
          fontSize:'1.5rem',
          fontWeight:'bold',
          color:'#636566'
        }}>
          {title || 'Received Amount'}
        </Typography>

        <BarChartOutlinedIcon sx={{
          background:'#ffe9e9',
          color:'#E6212A',
          borderRadius:'50%',
          padding:isMobile ? '0.5rem' : '1rem',
          fontSize:'1rem',
          height: isMobile ? '3rem' : '4rem',
          width: isMobile ? '3rem' : '4rem'
        }}/>

      </Box>

      {/* middle section */}

      <Box>

        {isLoading ? 
        
        <CircularProgress /> 
        : (

         <Typography sx={{
            fontSize:isMobile ? '2rem' : '1.5rem',
            fontWeight:'bold',
            color:'#333435',
            textAlign:'center',
            marginTop: isMobile ? '1rem' : 0,
          }}>
            {amount || '0'} DA
          </Typography>
        )}

      </Box>
    </Box>
  )
}