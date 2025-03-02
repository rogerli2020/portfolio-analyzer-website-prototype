from riskutils.portfolio import Portfolio

class RiskUtilQuery:
    def __init__(self, user_portfolio : list[dict], time_horizon_days : int):
        self.user_portfolio = user_portfolio
        self.time_horizon_days = time_horizon_days
    
    def get_query_results(self):
        MyPortfolio = Portfolio(self.time_horizon_days)
        for position in self.user_portfolio:
            MyPortfolio.create_and_add_position(
                position["ticker"], position["position_type"], position["quantity"]
            )
        MyPortfolio.fetch_stocks_time_series()
        MyPortfolio.calculate_portfolio_value_time_series()
        MyPortfolio.calculate_portfolio_log_daily_returns()
        results = {
            **MyPortfolio.get_portfolio_risk_measures(),
            **MyPortfolio.get_sp500_risk_measures(),
            "logreturn_ts": {str(date): value for date, value in MyPortfolio.portfolio_time_series["Log Return"].dropna().items()},
            "portfolio_ts": {str(date): value for date, value in MyPortfolio.portfolio_time_series["Total Value"].items()},
            "scaled_sp500_ts": {str(date): value for date, value in MyPortfolio.sp500_time_series["Close"]["^GSPC"].items()}
        }

        return results