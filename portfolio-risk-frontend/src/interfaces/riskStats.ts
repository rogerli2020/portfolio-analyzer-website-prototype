export interface RiskStats {
    portfolio_volatility: number;
    portfolio_VaR: number;
    portfolio_ES: number;
    sp500_volatility: number;
    sp500_VaR: number;
    sp500_ES: number;
    logreturn_ts: Record<string, number>; // Keys are date strings, values are numbers
    portfolio_ts: Record<string, number>;
    scaled_sp500_ts: Record<string, number>;
}