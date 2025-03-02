from flask import Flask
from flask_restx import Resource, Api
from riskutils.risk_util_query import RiskUtilQuery
from riskutils.exceptions import *
from flask_restx import reqparse

app = Flask(__name__)
api = Api(app)

portfolioparser = reqparse.RequestParser()
portfolioparser.add_argument('positions', type=list, location='json', 
                    required=True, help="positions must be a list")
portfolioparser.add_argument('time_horizon', type=int, location='json', 
                    required=True, help="positions must be an int")

@api.route('/hello')
class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}
    
@api.route('/calcrisk')
class CalcRisk(Resource):
    def get(self):
        args = portfolioparser.parse_args()
        try:
            this_request = RiskUtilQuery(args["positions"], args["time_horizon"])
            return this_request.get_query_results(), 200
        except DataScrapingError:
            return {"message": "Data scraping error"}, 500
        except:
            return {"message": "unknown server error"}, 500

if __name__ == '__main__':
    app.run(debug=True)