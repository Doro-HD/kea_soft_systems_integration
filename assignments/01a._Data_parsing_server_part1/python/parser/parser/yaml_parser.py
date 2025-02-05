import yaml
import pokemon


def parse():
    pok = None
    with open('./parser/files/evee.yaml') as f:
        pok_yaml = yaml.safe_load(f)
        name = pok_yaml['name']
        typ = pok_yaml['type']
        pokedex_number = pok_yaml['pokedex_number']
        abilities = pok_yaml['abilities']
        hp = pok_yaml['base_stats']['hp']
        attack = pok_yaml['base_stats']['attack']
        defense = pok_yaml['base_stats']['defense']
        special_attack = pok_yaml['base_stats']['special_attack']
        special_defense = pok_yaml['base_stats']['special_defense']
        speed = pok_yaml['base_stats']['speed']
        evolution = pok_yaml['evolution']

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
