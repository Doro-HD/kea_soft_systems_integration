from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

spacecrafts_router = APIRouter()


class Spacecraft(BaseModel):
    id: int
    name: str


class SpacecraftRequestModel(BaseModel):
    name: str


spacecrafts = [
    Spacecraft(id=0, name='Apollo 13'),
    Spacecraft(id=1, name='Challenger'),
    Spacecraft(id=2, name='Enterprise')
]


@spacecrafts_router.get('/api/spacecrafts', tags=['spacecraft'], response_model=list[Spacecraft])
def get_spacecraft():
    return spacecrafts


@spacecrafts_router.get('/api/spacecrafts/{spacecraft_id}', tags=['spacecraft'], response_model=Spacecraft)
def get_spacecraft_by_id(spacecraft_id: int):
    for spacecraft in spacecrafts:
        if spacecraft.id == spacecraft_id:
            return spacecraft

    raise HTTPException(status_code=404, detail='Spacecraft not found')


@spacecrafts_router.post('/api/spacecrafts', tags=['spacecraft'], response_model=Spacecraft)
def create_spacecraft(spacecraft: SpacecraftRequestModel):
    new_spacecraft = Spacecraft(id=5, name=spacecraft.name)
    spacecrafts.append(new_spacecraft)

    return spacecraft
