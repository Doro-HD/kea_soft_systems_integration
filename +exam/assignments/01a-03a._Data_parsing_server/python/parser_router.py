from fastapi import APIRouter

from txt_parser import parse as parse_txt
from csv_parser import parse as parse_csv
from json_parser import parse as parse_json
from xml_parser import parse as parse_xml
from yaml_parser import parse as parse_yaml

router = APIRouter()


@router.get('/txt')
def txt():
    return parse_txt()


@router.get('/csv')
def csv():
    return parse_csv()


@router.get('/json')
def json():
    return parse_json()


@router.get('/xml')
def xml():
    return parse_xml()


@router.get('/yaml')
def yaml():
    return parse_yaml()
