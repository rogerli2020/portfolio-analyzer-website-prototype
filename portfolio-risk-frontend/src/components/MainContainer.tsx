import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import UserPortfolioDisplay from './UserPortfolioDisplay';
import RiskDisplay from './RiskDisplay';
import Link from '@mui/material/Link';


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
          Backend server is needed for the web app, but you can generate example data by clicking "LOAD EXAMPLE DATA".
        </Typography>
        <Link href="https://github.com/rogerli2020/portfolio-analyzer-website-prototype" variant="body2">
          {'GitHub Link'}
        </Link>

        <UserPortfolioDisplay/>
        <RiskDisplay/>

      </Card>
    </Box>
  );
}