from abc import ABC, abstractmethod

from easy_poe.poe.item.item import Item


class Currency(ABC):

    @staticmethod
    @abstractmethod
    def cost():
        pass

    @staticmethod
    @abstractmethod
    def can_apply_to(item: Item):
        pass

    @staticmethod
    @abstractmethod
    def apply_to(item: Item):
        pass
