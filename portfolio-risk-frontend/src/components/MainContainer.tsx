import React from 'react';
import logo from './logo.svg';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';

export default function MainContainer() {
  return (
    <Box component="section" sx={{ m: 10 }}>
      <Card variant="outlined" sx={{p: 5}}>
        <Typography variant="h3" sx={{ fontFamily: '"Times New Roman", serif', fontWeight: 900 }} gutterBottom>
          Simple Portfolio Risk Analyzer
        </Typography>
        <Typography variant="subtitle1">
          Enter your portfolio and choose a time horizon to calculate its Value at Risk (VaR), Expected Shortfall (ES), and volatility.
        </Typography>
        <Divider />
        <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
          noValidate
          autoComplete="off"
        >
          <TextField id="ticker-field" label="ticker" variant="outlined" />
          <TextField id="quantity-field" label="quantity" variant="filled" />
          <TextField id="standard-basic" label="Standard" variant="standard" />
        </Box>
      </Card>
    </Box>
  );
}