from riskutils.risk_util_query import RiskUtilQuery

positions = [
    {
        "ticker": "NVDA",
        "position_type": "long",
        "quantity": "50",
    },
    {
        "ticker": "TSLA",
        "position_type": "long",
        "quantity": "20",
    },
    {
        "ticker": "AAPL",
        "position_type": "short",
        "quantity": "10",
    }
]

print(RiskUtilQuery(positions, 60).get_query_results())