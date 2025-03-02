# SPAGHETTI CODE AHEAD!!
# this needs some refactoring 

from riskutils.position import Position
from riskutils.enums import PositionType
from riskutils.exceptions import *
import datetime
import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

class Portfolio:
    def __init__(self, evaluation_time_horizon_days : int):
        self.evaluation_time_horizon_days = evaluation_time_horizon_days
        self.positions : list[Position] = []
        self.stock_time_series : dict[str : pd.DataFrame] = {}
        self.sp500_time_series : pd.DataFrame = None
        self.risk_free_rate_time_series : pd.DataFrame = None
        self.portfolio_time_series : pd.DataFrame = None
        self._stock_prices_fetched = False
    
    def create_position(self, ticker : str, position_type : str, 
                        quantity : int) -> Position:
        if position_type == "long":
            position_type = PositionType.LONG
        elif position_type == "short":
            position_type = PositionType.SHORT
        else:
            raise InvalidPositionTypeException
        new_position : Position = Position(
            ticker=ticker,
            position_type=position_type,
            quantity=quantity
        )

        return new_position

    def create_and_add_position(self, ticker : str, position_type : str, 
                                quantity : int) -> None:
        new_position = self.create_position(
            ticker=ticker,
            position_type=position_type,
            quantity=quantity
        )
        self.positions.append(new_position)

    def fetch_stocks_time_series(self):
        def get_historical_prices(ticker, start_date, end_date):
            try:
                data = yf.download(ticker, start=start_date, end=end_date)
                print(data.head())
                data = data[["Close"]]
                return data
            except Exception as e:
                print(e)
                raise DataScrapingError
        end_date = datetime.date.today()
        start_date = end_date - datetime.timedelta(days=self.evaluation_time_horizon_days)
        for position in self.positions:
            ticker = position.ticker
            if ticker in self.stock_time_series: continue
            self.stock_time_series[ticker] = get_historical_prices(
                ticker, start_date, end_date)
        
        self.sp500_time_series = get_historical_prices("^GSPC",
                                                       start_date, end_date)

        self._stock_prices_fetched = True
    
    def calculate_portfolio_value_time_series(self):
        def scale_sp500():
            initial_portfolio_value = self.portfolio_time_series["Total Value"].dropna().iloc[0]
            initial_sp500_value = self.sp500_time_series["Close"].dropna().iloc[0]

            print(initial_portfolio_value, type(initial_portfolio_value))
            print(initial_sp500_value, type(initial_sp500_value))
            self.sp500_time_series["Close"] = (
                self.sp500_time_series["Close"] * (
                    initial_portfolio_value / initial_sp500_value
                )
            )
    
        if not self._stock_prices_fetched:
            self.get_stocks_time_series()
        portfolio_value = pd.DataFrame()

        for position in self.positions:
            ticker = position.ticker
            position_type = position.position_type
            quantity = position.quantity

            # Get the Adjusted Close price time series for the ticker
            if ticker in self.stock_time_series:
                stock_prices = self.stock_time_series[ticker]["Close"].copy()
                
                # Calculate position value (LONG = +, SHORT = -)
                if position_type == PositionType.LONG:
                    position_value = stock_prices * quantity
                else:  # SHORT position
                    position_value = -stock_prices * quantity

                # Add to the portfolio value DataFrame
                if portfolio_value.empty:
                    portfolio_value = position_value.copy()
                else:
                    portfolio_value[ticker] = position_value

        # simple, perhaps too naive of an imputation.
        portfolio_value.fillna(method="ffill")

        # Sum across tickers to get total portfolio value over time
        portfolio_value["Total Value"] = portfolio_value.sum(axis=1)

        self.portfolio_time_series = portfolio_value

        scale_sp500()



    def get_sp500_risk_measures(self, confidence_level=0.95):
        log_returns = np.log(self.sp500_time_series["Close"] / self.sp500_time_series["Close"].shift(1)).dropna()
        
        volatility = log_returns.std().squeeze() * np.sqrt(252)  # Annualized volatility
        var = np.percentile(log_returns, (1 - confidence_level) * 100)  # Historical VaR
        es = log_returns[log_returns <= var].mean().squeeze()  # Expected Shortfall (Conditional VaR)

        return {
            "sp500_volatility": volatility,
            "sp500_VaR": var,
            "sp500_ES": es,
        }

    def get_portfolio_risk_measures(self, confidence_level=0.95):
        log_returns = np.log(self.portfolio_time_series["Total Value"] / self.portfolio_time_series["Total Value"].shift(1)).dropna()

        volatility = log_returns.std() * np.sqrt(252)  # Annualized volatility
        var = np.percentile(log_returns, (1 - confidence_level) * 100)  # Historical VaR
        es = log_returns[log_returns <= var].mean()  # Expected Shortfall (Conditional VaR)

        return {
            "portfolio_volatility": volatility,
            "portfolio_VaR": var,
            "portfolio_ES": es,
        }



    def calculate_portfolio_log_daily_returns(self, plot=False):
        if not self._stock_prices_fetched:
            self.fetch_stocks_time_series()

        portfolio_value = self.portfolio_time_series

        self.portfolio_time_series["Log Return"] = np.log(portfolio_value["Total Value"] / portfolio_value["Total Value"].shift(1))
        portfolio_value["Log Return"] = np.log(portfolio_value["Total Value"] / portfolio_value["Total Value"].shift(1))


        if not plot: return
        # Plot log returns
        plt.figure(figsize=(12, 5))
        plt.plot(portfolio_value.index, portfolio_value["Log Return"], label="Log Daily Return", color="blue", alpha=0.7)
        plt.axhline(y=0, color='black', linestyle='--', linewidth=1)
        plt.xlabel("Date")
        plt.ylabel("Log Return")
        plt.title("Portfolio Log Daily Return Over Time")
        plt.legend()
        plt.grid()
        plt.show()

        # Plot
        plt.figure(figsize=(12, 5))
        plt.plot(portfolio_value.index, portfolio_value["Total Value"], label="Portfolio", color="blue", alpha=0.7)
        plt.plot(self.sp500_time_series.index, self.sp500_time_series["Close"], label="SP500", color="red", alpha=0.7)
        plt.axhline(y=0, color='black', linestyle='--', linewidth=1)
        plt.xlabel("Date")
        plt.ylabel("Log Return")
        plt.title("Portfolio Log Daily Return Over Time")
        plt.legend()
        plt.grid()
        plt.show()