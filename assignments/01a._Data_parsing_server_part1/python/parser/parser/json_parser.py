import json
import pokemon


def parse():
    pok = None
    with open('./parser/files/squirtle.json') as f:
        pok_json = json.load(f)
        name = pok_json['name']
        typ = pok_json['type']
        pokedex_number = pok_json['pokedex_number']
        abilities = pok_json['abilities']
        hp = pok_json['base_stats']['hp']
        attack = pok_json['base_stats']['attack']
        defense = pok_json['base_stats']['defense']
        special_attack = pok_json['base_stats']['special_attack']
        special_defense = pok_json['base_stats']['special_defense']
        speed = pok_json['base_stats']['speed']
        evolution = pok_json['evolution']

        pok = pokemon.Pokemon(name,
                              typ,
                              pokedex_number,
                              abilities,
                              hp,
                              attack,
                              defense,
                              special_attack,
                              special_defense,
                              speed,
                              evolution)

    return pok
