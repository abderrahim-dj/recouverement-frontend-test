import {Box, Typography, CircularProgress} from "@mui/joy";

import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import MovingOutlinedIcon from '@mui/icons-material/MovingOutlined';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';

import useIsMobile from "../../hooks/useIsMobile";



export default function DashboardHomeCardUser ({title, number, isLoading}) {
 
  const isMobile = useIsMobile();
 
  return (
    /* main box */
    <Box sx={{
      //flex:1
      //paddingX:'5rem'
      padding:'2rem',
      borderRadius:'25px',
      border:'solid 1px #D4D4D4',
      boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.2)',


    }}>
      
      {/* top part */}
      <Box sx={{
        display:'flex',
        justifyContent: isMobile ? 'space-between' : 'space-around',
        gap:isMobile ? 0 :'3rem',
        paddingX: isMobile ? '0' : '0',
      }}>
        <Typography sx={{
          fontSize:'1.3rem',
          fontWeight:'bold',
          color:'#636566'
        }}>
          {title || 'Total clients'}
        </Typography> 
        <GroupOutlinedIcon sx={{
          background:'linear-gradient(135deg, #FFA5A5, #E6212A)',
          color:'white',
          borderRadius:'50%',
          padding:isMobile ? '0.5rem' : '1rem',
          fontSize:'1rem',
          height: isMobile ? '3rem' : '4rem',
          width: isMobile ? '3rem' :  '4rem'
        }}/>
      </Box>
      
      {/* middle part */}
      <Box>
        {isLoading ? 
        
          <CircularProgress /> 
          : (
          <Typography sx={{
            fontSize:isMobile ? '2rem' : '1.5rem',
            fontWeight:'bold',
            color:'#333435',
            textAlign:'center',
            marginTop: isMobile ? '1rem' : '0rem',
          }}>
            {number || '0'}
          </Typography>

        )}

      </Box>

    

    </Box>
  )
}