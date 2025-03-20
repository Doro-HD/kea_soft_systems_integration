"""
from websockets.sync.client import connect


def send_message():
    with connect('ws://127.0.0.1:8000') as websocket:
        websocket.send('Hello World!')

        message = websocket.recv()
        print(f'Received: {message}')


send_message()
"""

import asyncio
import websockets


async def send_message():
    uri = 'ws://127.0.0.1:8000'
    async with websockets.connect(uri) as websocket:
        await websocket.send('This is my message')
        print(await websocket.recv())


# python 3.7 and below
# asyncio.get_event_loop().run_until_complete(send_message())

# after python 3.7
asyncio.run(send_message())
