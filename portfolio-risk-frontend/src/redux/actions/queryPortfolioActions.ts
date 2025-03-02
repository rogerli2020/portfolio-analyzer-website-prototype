import { PortfolioQuery } from "../../interfaces/portfolioQuery";

export const updateQueryPortfolio = (data: PortfolioQuery) => ({
    type: 'UPDATE_QUERY_PORTFOLIO',
    payload: data,
});