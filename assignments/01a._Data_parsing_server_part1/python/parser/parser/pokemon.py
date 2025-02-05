class Pokemon:
    def __init__(self,
                 name: str,
                 typ: str,
                 pokedex_number: str,
                 abilities: list[str],
                 hp: str,
                 attack: str,
                 defense: str,
                 special_attack: str,
                 special_defense: str,
                 speed: str,
                 evolution: str):
        self.name = name
        self.typ = typ
        self.pokedex_number = pokedex_number
        self.abilities = abilities
        self.hp = hp
        self.attack = attack
        self.defence = defense
        self.special_attack = special_attack
        self.special_defense = special_defense
        self.speed = speed
        self.evolution = evolution

    def __repr__(self):
        return f'''
        Name: {self.name}
        Type: {self.typ}
        Pokedex Number: {self.pokedex_number}
        Abilities: {','.join(self.abilities)}
        HP: {self.hp}
        Attack: {self.attack}
        Defense: {self.defence}
        Special Attack: {self.special_attack}
        Special Defense: {self.special_defense}
        Speed: {self.speed}
        Evolution: {self.evolution}
        '''
