import requests
from flask import Flask, render_template
from lxml import html

app = Flask(__name__)


def get_last_status():
    page = requests.get('https://shop.boulderbar.net:8080/modules/bbext/CurrentCustomer.php')
    tree = html.fromstring(page.content)
    free_spaces = tree.xpath('//div[@class="text"]/text()')

    status = {'Hannovergasse': free_spaces[0], 'Hauptbahnhof': free_spaces[1], 'Wienerberg': free_spaces[2]}

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
