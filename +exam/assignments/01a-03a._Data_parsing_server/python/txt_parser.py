import pokemon


def build_pokemon(pokemon_list):
    name = None
    typ = None
    pokedex_number = None
    abilities = None
    hp = None
    attack = None
    defense = None
    special_attack = None
    special_defense = None
    speed = None
    evolution = None

    for pok_attribute in pokemon_list:
        if pok_attribute[0] == 'Name':
            name = pok_attribute[1]
        elif pok_attribute[0] == 'Type':
            typ = pok_attribute[1]
        elif pok_attribute[0] == 'Pokédex Number':
            pokedex_number = pok_attribute[1]
        elif pok_attribute[0] == 'Abilities':
            abilities = pok_attribute[1].split(',')
        elif pok_attribute[0] == 'HP':
            hp = pok_attribute[1]
        elif pok_attribute[0] == 'Attack':
            attack = pok_attribute[1]
        elif pok_attribute[0] == 'Defense':
            defense = pok_attribute[1]
        elif pok_attribute[0] == 'Special Attack':
            special_attack = pok_attribute[1]
        elif pok_attribute[0] == 'Special Defense':
            special_defense = pok_attribute[1]
        elif pok_attribute[0] == 'Speed':
            speed = pok_attribute[1]
        elif pok_attribute[0] == 'Evolution':
            evolution = pok_attribute[1]

    return pokemon.Pokemon(name,
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


def parse():
    pok = None
    with open('./files/pikachu.txt') as f:
        lines = f.readlines()

        # remove \n
        lines = [line for line in filter(lambda line: line != '\n', lines)]
        lines = [line for line in map(
            lambda line: line.replace('\n', ''), lines)]

        # split up key and values
        key_values = [line for line in map(
            lambda line: line.split('='), lines)]

        pok = build_pokemon(key_values)

    return pok
