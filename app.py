import csv

import requests
from flask import Flask, render_template

app = Flask(__name__)


def get_last_status():
    url = 'http://81.189.135.217:8085/static/data/boulderbar.csv'
    r = requests.get(url)
    csv_summary = r.content.decode('utf-8')

    cr = csv.reader(csv_summary.splitlines(), delimiter=';')

    status = {}

    for row in cr:
        if row[1] == 'Hannovergasse':
            status['Hannovergasse'] = row[3]
        elif row[1] == 'Hauptbahnhof':
            status['Hauptbahnhof'] = row[3]
        elif row[1] == 'Wienerberg':
            status['Wienerberg'] = row[3]
        elif row[1] == 'Blockfabrik':
            status['Blockfabrik'] = row[3]

    return status


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/status')
def all_status():
    return get_last_status()

@app.route('/status/<string:name>')
def get_status(name):
    return get_last_status()[name]


if __name__ == "__main__":
    app.run(host='0.0.0.0')
