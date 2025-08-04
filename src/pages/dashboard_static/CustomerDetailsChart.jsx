import React from 'react';
// Remove Pie chart and Chart.js imports if no longer needed in this file
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Remove ChartJS registration if no longer needed
// ChartJS.register(ArcElement, Tooltip, Legend);

// Helper function to format currency (optional, but keeps formatting consistent)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'DZD' }).format(value);
};


export default function CustomerDetailsChart({ data }) {
  const startApport = data?.customer_apport_personnel_start || 0;
  const currentApport = data?.customer_apport_personnel_current || 0;
  // Ensure paidAmount isn't negative if current somehow exceeds start
  const paidAmount = Math.max(0, startApport - currentApport);

  // Calculate progress percentage, handle division by zero
  const progressPercentage = startApport > 0 ? (paidAmount / startApport) * 100 : 0;
  // Ensure the value is clamped between 0 and 100 for the progress bar
  const clampedPercentage = Math.max(0, Math.min(100, progressPercentage));

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center', p: 1 }}>

      {/* Progress Bar with Percentage Label */}
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={clampedPercentage}
            sx={{
              height: 12, // Make the bar thicker
              borderRadius: 6, // Round the corners
              '& .MuiLinearProgress-bar': {
                transition: 'transform .4s linear', // Smooth animation
              },
            }}
          />
        </Box>
        <Box sx={{ minWidth: 40 }}> {/* Ensure space for percentage */}
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
            {`${Math.round(clampedPercentage)}%`}
          </Typography>
        </Box>
      </Box>

       {/* Optional: Display Remaining amount */}
       <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
         <Typography variant="body2" color="text.secondary">{`Remaining: ${formatCurrency(currentApport)}`}</Typography>
       </Box>
    </Box>
  );
}