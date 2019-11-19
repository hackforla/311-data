import os
import json
from flask import Flask

app = Flask(__name__)
app.config.from_pyfile(os.path.join(os.getcwd(),'settings.cfg'))

@app.route('/')
def index():
    return 'You hit the index'

@app.route('/sample-data')
def sample_route():
    sample_dataset = {'cool_key':['value1', 'value2'], app.config['REDACTED']:app.config['REDACTED']}
    return json.dumps(sample_dataset, indent=4)

if __name__ == '__main__':
    app.run()
