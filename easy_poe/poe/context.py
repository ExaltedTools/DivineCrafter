import json
from importlib import resources

from easy_poe.poe.item.modifier import Modifier


def _load_modifiers():
    modifiers_json = resources.files("resources").joinpath("modifiers.json")
    return json.loads(modifiers_json.read_text(), object_hook=Modifier.from_json)


class Context:
    ALL_MODIFIERS = _load_modifiers()

    @staticmethod
    def get_all_modifiers_id():
        return list(map(lambda m: m.id, Context.ALL_MODIFIERS))
