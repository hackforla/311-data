import json
from flask_cors import CORS
from flask import Flask, jsonify, request
from utils.BasicSodaClient import BasicSodaClient
from utils.TreeMapper import TreeMapper
from utils.DataRepository import DataRepository


# Initialization
app = Flask(__name__)

# Configuration
app.config.from_pyfile('config.cfg')

CORS(app)

# Datastore connector
repo = DataRepository(connection_string=app.config["DB_CONNECTION_STRING"])


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


@app.route("/treemap", methods=["GET", "POST"])
def treemap():
    response = {}
    tree_map_gen = TreeMapper(repo)
    nc_name = None
    if request.method == "POST":
        params = request.get_json()
        nc_name = params.get("nc_name", None)

    if not nc_name:
        broad_data = tree_map_gen.BroadMap()
        response["Message"] = "Retrieved broad NC Dataset"
        response["StatusCode"] = 200
        response["Payload"] = broad_data

    else:
        nc_data = tree_map_gen.NCMap(nc_name)
        response["Message"] = "Retrieved zoomed NC Dataset for " + nc_name
        response["StatusCode"] = 200
        response["Payload"] = nc_data

    return jsonify(response)



@app.route("/seed_db", methods=["GET","POST"])
def seed_db():
    response = {}

    if request.method == "POST":
        params = request.get_json()
        db = params.get("db_provider", app.config["DEFAULT_DB_PROVIDER"])
        if db == "postgres":
            from utils.DBSeeder import DBSeeder
            connection_string = app.config["DB_CONNECTION_STRING"]

            seeder = DBSeeder(connection_string=connection_string)
            seeder.seed_with_file(path="static/MyLA311_Service_Request_Data_2017_Subset.csv", table_name="seed_data")
            response["Message"] = "You have seeded the database"
            response["DatabaseProvider"] = db
            response["StatusCode"] = 200
    else:
        response["Message"] = "Possible database providers are: postgre"
        response["StatusCode"] = 200
    return jsonify(response)



if __name__ == "__main__":
    app.run(host=app.config["HOST"], port=app.config["PORT"], debug=app.config["DEBUG"])
