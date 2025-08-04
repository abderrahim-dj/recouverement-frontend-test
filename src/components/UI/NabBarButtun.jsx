import { Box, Typography } from "@mui/joy"
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';


export default function () {
  return (
    <Box sx={{ display: 'flex', gap: '1rem',alignItems: 'center' }}>
      <PersonOutlineOutlinedIcon fontSize="large" />
      <Typography fontSize={'1.5rem'}>username</Typography>
    </Box>
  )
}