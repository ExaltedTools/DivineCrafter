import numpy as np

from easy_poe.poe.currency.currency import Currency
from easy_poe.poe.item.item import Rarity, Item


class Augmentation(Currency):

    _cost = 1

    @staticmethod
    def cost():
        pass

    @staticmethod
    def can_apply_to(item):
        return item.rarity == Rarity.MAGIC and len(item.get_empty_affix_indices()) < Rarity.MAGIC

    @staticmethod
    def apply_to(item):
        empty_affix_indices = item.get_empty_affix_indices()
        if (len(empty_affix_indices)) > 0:
            empty_mod_index = np.random.choice(empty_affix_indices)
            item.set_affix(empty_mod_index, item.get_available_modifier())
