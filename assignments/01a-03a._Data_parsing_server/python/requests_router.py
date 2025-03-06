from fastapi import APIRouter
import requests

router = APIRouter()

PATH = 'http://127.0.0.1:8080'


@router.get('/txt')
def request_txt():
    response = requests.get(f'{PATH}/txt')

    return response.json()


@router.get('/csv')
def request_csv():
    response = requests.get(f'{PATH}/csv')

    return response.json()


@router.get('/json')
def request_json():
    response = requests.get(f'{PATH}/json')

    return response.json()


@router.get('/xml')
def request_xml():
    response = requests.get(f'{PATH}/xml')

    return response.json()


@router.get('/yaml')
def request_yaml():
    response = requests.get(f'{PATH}/yaml')

    return response.json()
