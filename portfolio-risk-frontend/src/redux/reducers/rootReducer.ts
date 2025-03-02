// rootReducer.ts

import { combineReducers } from 'redux';
import queryPortfolioReducer from './queryPortfolioReducer';
import riskStatsReducer from './riskStatsSlice';

const rootReducer = combineReducers({
    queryPortfolio: queryPortfolioReducer,
    riskStats: riskStatsReducer
});

export default rootReducer;