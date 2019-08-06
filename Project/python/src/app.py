import json
from flask_cors import CORS
from flask import Flask, jsonify, request
from utils.BasicSodaClient import BasicSodaClient


# Initialization
app = Flask(__name__)

# Configuration
app.config.from_pyfile('config.cfg')

# CORS to allow all on localhost:3000
cors = CORS(app, resources={r"/*": {"origins": app.config["FRONTEND_SERVER"]}})



# Routing
@app.route('/')
def index():
    response = {}
    response["Message"] = "You have reached the index"
    response["Payload"] = {}
    response["StatusCode"] = 200
    return jsonify(response)



@app.route('/healthcheck', methods=["GET"])
def healthcheck():
    response = {}
    response["Message"] = "Healthy"
    response["Payload"] = {}
    response["StatusCode"] = 200
    return jsonify(response)



@app.route("/getjson")
def getjson():
    response = {}
    response["Message"] = "You have reached the index"
    response["Payload"] = {"2016_Bulky_Items_Call_Volume": 8675309,
                           "2017_Bulky_Items_Call_Volume": 4242424}
    response["StatusCode"] = 200
    return jsonify(response)



@app.route("/dataframe", methods=["POST"])
def get_dataframe():
    response = {}
    params = request.get_json()
    data_id = params.get("data_id", None)

    if not data_id:
        response["Message"] = "Missing param: data_id"
        response["StatusCode"] = 500
        return jsonify(response)

    soda_client = BasicSodaClient(domain=app.config["DATA_DOMAIN"], token=app.config["SODAPY_APPTOKEN"])
    frame_json = soda_client.get_socrata_df(identifier=data_id)


    response["Message"] = "Retrieved data frame"
    response["Domain"] = app.config["DATA_DOMAIN"]
    response["DataId"] = data_id
    response["Payload"] = json.loads(frame_json)
    response["StatusCode"] = 200
    return jsonify(response)



@app.route("/seed_db", methods=["GET","POST"])
def seed_db():
    response = {}

    if request.method == "POST":
        params = request.get_json()
        db = params.get("db_provider", app.config["DEFAULT_DB_PROVIDER"])

        response["Message"] = "You have seeded the database"
        response["DatabaseProvider"] = db
        response["StatusCode"] = 200
    else:
        response["Message"] = "Possible database providers are: postgre"
        response["StatusCode"] = 200
    return jsonify(response)



if __name__ == "__main__":
    app.run(host=app.config["HOST"], port=app.config["PORT"], debug=app.config["DEBUG"])
