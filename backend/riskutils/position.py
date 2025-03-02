from riskutils.enums import PositionType

class Position:
    def __init__(self, ticker : str, position_type : PositionType, quantity : float):
        quantity = float(quantity)
        self.ticker = ticker
        self.position_type = position_type
        self.quantity = quantity
    
