import numpy as np

from easy_poe.poe.context import Context
from easy_poe.poe.currency.currency import Currency
from easy_poe.poe.item.item import Rarity


class Chaos(Currency):

    @staticmethod
    def cost():
        return 1

    @staticmethod
    def can_apply_to(item):
        return item.rarity == Rarity.RARE

    @staticmethod
    def apply_to(item):
        item.affixes = np.random.choice(np.arange(0, len(Context.ALL_MODIFIERS) + 1),
                                        size=Rarity.RARE,
                                        replace=False)
