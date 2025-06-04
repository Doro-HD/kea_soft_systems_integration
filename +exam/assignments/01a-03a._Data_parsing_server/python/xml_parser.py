import bs4 as bs
import pokemon


def parse():
    pok = None
    with open('./files/jigglypuff.xml') as f:
        file = bs.BeautifulSoup(f, 'lxml')

        name = file.find('name').text
        typ = file.find('type').text
        pokedex_number = file.find('pokedex_number').text
        abilities = [ability.text for ability in file.find_all('ability')]
        hp = file.find('hp').text
        attack = file.find('attack').text
        defense = file.find('defense').text
        special_attack = file.find('special_attack').text
        special_defense = file.find('special_defense').text
        speed = file.find('speed').text
        evolution = file.find('evolution').text

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
