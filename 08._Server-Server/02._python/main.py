from dotenv import load_dotenv
import os
from fastapi import FastAPI
import requests
import random

app = FastAPI()


@app.get('/fast-api-data')
def root():
    return {'data': 'This is the data from fast api'}


@app.get('/requests-express-data')
def request_express_data():
    response = requests.get('http://127.0.0.1:8080/express-data')

    return {'express': response.json()}


@app.get('/play-next')
def play_next():
    load_dotenv()
    key = os.getenv('RAWG_API_KEY')

    response = requests.get('https://api.rawg.io/api/games',
                            params={'key': key})
    games = response.json().get('results')

    random_index = random.randrange(0, len(games) - 1)

    return games[random_index]
