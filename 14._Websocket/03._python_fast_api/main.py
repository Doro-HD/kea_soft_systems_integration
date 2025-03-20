from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse

from connection_manager import ConnectionManager

import html_doc

app = FastAPI()

connection_manager = ConnectionManager()


@app.get("/")
async def get():
    return HTMLResponse(html_doc.html)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await connection_manager.connect(websocket)
    try:
        while True:
            data = await websocket.recieve_text()
            await connection_manager.broadcast(f'Message was: {data}')
    except WebSocketDisconnect:
        connection_manager.disconnect(websocket)
        await connection_manager.broadcast('Client disconnected')
