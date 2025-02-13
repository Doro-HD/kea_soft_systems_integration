from fastapi import FastAPI

app = FastAPI()


@app.get('/')
def root():
    return {"data": "Hello World!"}


@app.get('/greeting')
def greeting():
    return {"greeting": "Welcome"}
