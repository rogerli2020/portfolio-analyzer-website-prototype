// rootReducer.ts

import { combineReducers } from 'redux';
import queryPortfolioReducer from './queryPortfolioReducer';

const rootReducer = combineReducers({
    queryPortfolio: queryPortfolioReducer
});

export default rootReducer;