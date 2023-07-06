import numpy as np

from easy_poe.poe.currency.currency import Currency
from easy_poe.poe.item.item import Rarity
from easy_poe.poe.item.modifier import Modifier


class Alchemy(Currency):
    _cost = 1

    @staticmethod
    def cost():
        pass

    @staticmethod
    def can_apply_to(item):
        return item.rarity == Rarity.NORMAL

    @staticmethod
    def apply_to(item):
        item.affixes = np.random.choice(np.arange(0, len(Modifier) + 1),
                                        size=Rarity.RARE,
                                        replace=False)
        item.rarity = Rarity.RARE
