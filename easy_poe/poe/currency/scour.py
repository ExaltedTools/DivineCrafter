import numpy as np

from easy_poe.poe.currency.currency import Currency
from easy_poe.poe.item.item import Rarity, Item


class Scour(Currency):

    _cost = 1

    @staticmethod
    def cost():
        pass

    @staticmethod
    def can_apply_to(item):
        return item.rarity != Rarity.NORMAL

    @staticmethod
    def apply_to(item):
        item.affixes = np.zeros((Item.MAX_AFFIXES,), dtype=np.int32)
        item.rarity = Rarity.NORMAL
