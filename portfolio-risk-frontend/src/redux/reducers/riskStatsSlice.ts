import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RiskStats } from '../../interfaces/riskStats';

// Initial State
const initialState: RiskStats = {
  portfolio_volatility: 0,
  portfolio_VaR: 0,
  portfolio_ES: 0,
  sp500_volatility: 0,
  sp500_VaR: 0,
  sp500_ES: 0,
  logreturn_ts: {
    "1900-01-01 00:00:00": 0,
    "2000-01-01 00:00:00": 0
  },
  portfolio_ts: {
    "1900-01-01 00:00:00": 0,
    "2000-01-01 00:00:00": 0
  },
  scaled_sp500_ts: {
    "1900-01-01 00:00:00": 0,
    "2000-01-01 00:00:00": 0
  }
};

// Async Thunk to Fetch Risk Stats from API
export const fetchRiskStats = createAsyncThunk(
  'riskStats/fetchRiskStats',
  async (portfolioQuery: any, { rejectWithValue }) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/calcrisk", {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolioQuery),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch risk stats');
      }

      return await response.json(); // Return response data
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


const riskStatsSlice = createSlice({
  name: 'riskStats',
  initialState,
  reducers: {
    updateRiskStats(state, action: PayloadAction<RiskStats>) {
      return action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRiskStats.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(fetchRiskStats.rejected, (state, action) => {
        console.error('Failed to fetch risk stats:', action.payload);
      });
  }
});


export const { updateRiskStats } = riskStatsSlice.actions;
export default riskStatsSlice.reducer;
