import csv
import pokemon


def parse():
    pok = None
    with open('./parser/files/bulbasaur.csv') as f:
        rows = csv.DictReader(f)
        for row in rows:
            name = row['Name']
            typ = row['Type']
            pokedex_number = row['Pokédex Number']
            abilities = row['Abilities'].split('/')
            hp = row['Base HP']
            attack = row['Base Attack']
            defense = row['Base Defense']
            special_attack = row['Base Special Attack']
            special_defense = row['Base Special Defense']
            speed = row['Base Speed']
            evolution = row['Evolution']

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
