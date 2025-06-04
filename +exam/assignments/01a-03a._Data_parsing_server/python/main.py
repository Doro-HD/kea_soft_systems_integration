from fastapi import FastAPI

import parser_router
import requests_router


app = FastAPI()

app.include_router(parser_router.router)
app.include_router(requests_router.router, prefix='/requests')
