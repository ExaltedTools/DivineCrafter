class Modifier:

    def __init__(self, id, name, weight, affix_type):
        self.id = id
        self.name = name
        self.weight = weight
        self.affix_type = affix_type

    @staticmethod
    def from_json(json_dct):
        return Modifier(json_dct['id'],
                        json_dct['name'],
                        json_dct['weight'],
                        json_dct['affix_type'])
