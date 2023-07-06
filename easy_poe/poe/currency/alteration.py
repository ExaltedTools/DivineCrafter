import numpy as np

from easy_poe.poe.currency.currency import Currency
from easy_poe.poe.item.item import Rarity
from easy_poe.poe.item.modifier import Modifier


class Alteration(Currency):
    _cost = 1

    @staticmethod
    def cost():
        pass

    @staticmethod
    def can_apply_to(item):
        return item.rarity == Rarity.MAGIC

    @staticmethod
    def apply_to(item):
        tmp_affixes = np.random.choice(np.arange(0, len(Modifier) + 1),
                                       size=Rarity.MAGIC,
                                       replace=False)
        item.affixes = np.pad(tmp_affixes, (0, Rarity.RARE - Rarity.MAGIC), 'constant')
