from abc import ABC, abstractmethod

from easy_poe.poe.item.item import Item


class Currency(ABC):

    _cost = 1

    @staticmethod
    @abstractmethod
    def cost():
        return Currency._cost

    @staticmethod
    @abstractmethod
    def can_apply_to(item: Item):
        pass

    @staticmethod
    @abstractmethod
    def apply_to(item: Item):
        pass
