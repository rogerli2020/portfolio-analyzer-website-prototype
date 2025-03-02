
class InvalidPositionTypeException(Exception):
    def __init__(self, *args):
        super().__init__(*args)

class DataScrapingError(Exception):
    def __init__(self, *args):
        super().__init__(*args)