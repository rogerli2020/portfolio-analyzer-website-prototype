import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch } from "react-redux";
import { PortfolioItem } from '../interfaces/portfolioItem';
import { PortfolioQuery } from '../interfaces/portfolioQuery';
import { enqueueSnackbar } from 'notistack'
import { fetchRiskStats } from '../redux/reducers/riskStatsSlice';
import type { ThunkDispatch } from "@reduxjs/toolkit";
import { RiskStats } from '../interfaces/riskStats';
import { RiskStatsActions } from '../redux/reducers/riskStatsSlice';

export default function UserPortfolioDisplay() {
    const dispatch = useDispatch<ThunkDispatch<RiskStats, void, RiskStatsActions>>(); // Quick fix!

    const [stockPosition, setStockPosition] = useState<"long" | "short">("long");
    const [stockTicker, setStockTicker] = useState<string>("");
    const [stockQuantity, setStockQuantity] = useState<string>("");
    const [timeHorizon, setTimeHorizon] = useState<string>("0");
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

    const handleStockPositionChange = (event: SelectChangeEvent) => {
        setStockPosition(event.target.value as "long" | "short");
    };

    const handleStockTickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStockTicker(event.target.value);
    };

    const handleStockQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStockQuantity(event.target.value);
    };

    const handleTimeHorizonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTimeHorizon(event.target.value);
    };

    const handleNewStockPosition = () => {
        if (!stockTicker || !stockQuantity) {
            return;
        }
        const newItem : PortfolioItem = {
            ticker: stockTicker,
            quantity: Number(stockQuantity),
            position_type: stockPosition as "long" | "short"
        }
        setStockPosition("long");
        setStockTicker("");
        setStockQuantity("");
        setPortfolio([...portfolio, newItem]);
    };

    const handleResetPortfolio = () => {
        setPortfolio([]);
    };

    const handleSubmission = () => {
        const newQueryPortfolio : PortfolioQuery = {
            positions: portfolio,
            time_horizon: Number(timeHorizon)
        }

        dispatch(fetchRiskStats(newQueryPortfolio))
        .unwrap()
        .then(() => {
            enqueueSnackbar("Risk stats updated!", { variant: "success" });
        })
        .catch((error) => {
            enqueueSnackbar(`Error: ${error}`, { variant: "error" });
        });
    }

    
    return (
        <Box sx={{marginTop : 5}}>
            <Typography variant="h5">
                YOUR PORTFOLIO
            </Typography>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>TICKER</TableCell>
                        <TableCell align="right">QUANTITY</TableCell>
                        <TableCell align="right">POSITION</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {portfolio.map((row : PortfolioItem) => (
                        <TableRow
                        key={row?.ticker}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {row?.ticker}
                        </TableCell>
                        <TableCell align="right">{row?.quantity}</TableCell>
                        <TableCell align="right">{row?.position_type}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>

        <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1, width: '100%' } }}
          noValidate
          autoComplete="off"
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'nowrap', maxWidth: '100%', width: '100%', mx: 'auto' }}>
            <TextField 
              id="ticker-field" 
              label="Stock Ticker" 
              value={stockTicker} 
              onChange={handleStockTickerChange} 
              variant="outlined" 
            />
            <TextField 
              id="quantity-field" 
              label="Stock Quantity" 
              value={stockQuantity} 
              onChange={handleStockQuantityChange} 
              variant="filled" 
              type="number"
            />
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={stockPosition}
              onChange={handleStockPositionChange}
            >
              <MenuItem value={"short"}>Short</MenuItem>
              <MenuItem value={"long"}>Long</MenuItem>
            </Select>
            <Button variant="contained" sx={{ minWidth: 120 }} onClick={handleNewStockPosition}>Add to portfolio</Button>
          </Box>
        </Box>
        <TextField 
              id="timehorizon-field" 
              label="Time Horizon (Days)" 
              value={timeHorizon} 
              onChange={handleTimeHorizonChange} 
              variant="filled"
              type="number"
            />

                <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{marginTop : 2}}
                    onClick={handleSubmission}
                >
                    Calculate Risk Metrics
                </Button>

                <Button 
                    variant="contained" 
                    color="error" 
                    sx={{marginTop : 2}} 
                    onClick={handleResetPortfolio}
                >
                    Reset Portfolio
                </Button>
        </Box>
    )
}