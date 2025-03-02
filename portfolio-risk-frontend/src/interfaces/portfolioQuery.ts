import { PortfolioItem } from './portfolioItem';

export interface PortfolioQuery {
    portfolio: PortfolioItem[];
    time_horizon: number;
}
