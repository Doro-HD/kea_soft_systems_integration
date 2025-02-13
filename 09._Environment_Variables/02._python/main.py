import os
from dotenv import dotenv_values, load_dotenv


def first():
    load_dotenv()
    print(os.getenv('FOO'))


def second():
    config = dotenv_values('.env')
    print(config['FOO'])


first()
second()
