import asyncio

from websockets.asyncio.server import serve


async def handle_new_websocket(websocket):
    print('Client connect')

    async for message in websocket:
        print(message)
        await websocket.send(message)


async def main():
    async with serve(handle_new_websocket, 'localhost', 8000) as server:
        await server.serve_forever()


if __name__ == "__main__":
    asyncio.run(main())
