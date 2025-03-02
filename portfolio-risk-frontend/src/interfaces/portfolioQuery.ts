import { PortfolioItem } from './portfolioItem';

export interface PortfolioQuery {
    positions: PortfolioItem[];
    time_horizon: number;
}
