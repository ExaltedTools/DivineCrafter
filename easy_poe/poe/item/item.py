from abc import ABC
from enum import IntEnum

import numpy as np

from easy_poe.poe.context import Context


class Item(ABC):
    MAX_PREFIXES = 3
    MAX_SUFFIXES = 3
    MAX_AFFIXES = MAX_PREFIXES + MAX_SUFFIXES

    def __init__(self, rarity):
        self._rarity: Rarity = rarity
        self._affixes = np.zeros((Item.MAX_AFFIXES,), dtype=np.int32)

    @property
    def rarity(self):
        return self._rarity

    @rarity.setter
    def rarity(self, rarity):
        self._rarity = rarity

    @property
    def affixes(self):
        return self._affixes

    @affixes.setter
    def affixes(self, affixes):
        self._affixes = affixes

    def set_affix(self, index, mod):
        self._affixes[index] = mod

    def get_empty_prefix_count(self):
        return Item.MAX_PREFIXES - np.count_nonzero(self._affixes[-Item.MAX_PREFIXES:])

    def get_empty_suffix_count(self):
        return Item.MAX_SUFFIXES - np.count_nonzero(self._affixes[:Item.MAX_SUFFIXES])

    def get_empty_affix_count(self):
        return Item.MAX_AFFIXES - np.count_nonzero(self._affixes)

    def get_empty_affix_indices(self):
        return np.where(self._affixes == 0)[0]

    def get_affix_indices(self):
        return np.where(self._affixes != 0)[0]

    def has_empty_affix(self):
        return np.any(self._affixes == 0)

    def has_affix(self):
        return np.any(self.affixes != 0)

    def get_available_modifier(self):
        available_modifiers = np.setdiff1d(Context.get_all_modifiers_id(), self._affixes)
        return np.random.choice(available_modifiers)


class Rarity(IntEnum):
    NORMAL = 0,
    MAGIC = 2,
    RARE = 6
