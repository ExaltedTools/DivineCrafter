import numpy as np

from easy_poe.poe.currency.currency import Currency
from easy_poe.poe.item.item import Rarity


class Annul(Currency):

    @staticmethod
    def cost():
        return 8.5

    @staticmethod
    def can_apply_to(item):
        return item.rarity != Rarity.NORMAL and item.has_affix()

    @staticmethod
    def apply_to(item):
        affix_indices = item.get_affix_indices()
        if (len(affix_indices)) > 0:
            not_empty_mod_index = np.random.choice(affix_indices)
            item.affixes[not_empty_mod_index] = 0
