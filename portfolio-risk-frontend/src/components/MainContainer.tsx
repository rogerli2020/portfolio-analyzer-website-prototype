import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import UserPortfolioDisplay from './UserPortfolioDisplay';
import RiskDisplay from './RiskDisplay';

export default function MainContainer() {

  return (
    <Box component="section" sx={{ m: 10 }}>
      <Card variant="outlined" sx={{ p: 5 }}>
        <Typography variant="h3" sx={{ fontFamily: '"Times New Roman", serif', fontWeight: 900 }} gutterBottom>
          Simple Portfolio Risk Analyzer
        </Typography>
        <Typography variant="subtitle1">
          Enter your portfolio and choose a time horizon to calculate its Value at Risk (VaR), Expected Shortfall (ES), and volatility.
        </Typography>
        <Typography variant="subtitle2">
          Backend server is needed for the web app, but you an generate example data by clicking "LOAD EXAMPLE DATA".
        </Typography>

        <UserPortfolioDisplay/>
        <RiskDisplay/>

      </Card>
    </Box>
  );
}