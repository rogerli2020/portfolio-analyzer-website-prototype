import { PortfolioQuery } from "../../interfaces/portfolioQuery";
const initialState : PortfolioQuery = {
    portfolio: [],
    time_horizon: 0}

interface UpdateQueryPortfolioAction {
    type: 'UPDATE_QUERY_PORTFOLIO';
    payload: PortfolioQuery;
}
  
  type QueryPortfolioAction = UpdateQueryPortfolioAction;
  
  export default function queryPortfolioReducer(
    state = initialState, 
    action: QueryPortfolioAction
  ) {
    switch (action.type) {
      case 'UPDATE_QUERY_PORTFOLIO':
        return action.payload;
      default:
        return state;
    }
  }
  