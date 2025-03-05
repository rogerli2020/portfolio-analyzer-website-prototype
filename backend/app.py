from flask import Flask, request
from flask_restx import Resource, Api, reqparse
from flask_cors import CORS
from riskutils.risk_util_query import RiskUtilQuery
from riskutils.exceptions import *

app = Flask(__name__)
CORS(app)

api = Api(app)

@api.route('/calcrisk')
class CalcRisk(Resource):
    def options(self):
        """Handle CORS preflight request"""
        return {'Allow': 'POST'}, 200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }

    def post(self):
        try:
            data = request.get_json()
            positions = data.get("positions")
            time_horizon = data.get("time_horizon")
            
            if int(time_horizon) < 2:
                raise InvalidTimeHorizon()

            if not isinstance(positions, list) or not isinstance(time_horizon, int):
                return {"message": "Invalid input data"}, 400

            this_request = RiskUtilQuery(positions, time_horizon)
            return this_request.get_query_results(), 200

        except InvalidTimeHorizon as e:
            return {"message": f"Invalid Time Horizon. Make sure it's larger than 1"}, 400
        except DataScrapingError:
            return {"message": f"Data scraping error: {DataScrapingError}"}, 500
        except Exception as e:
            return {"message": f"Unknown server error: {str(e)}"}, 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
