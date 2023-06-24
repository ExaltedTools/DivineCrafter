from enum import Enum


class Currency(Enum):
    CHAOS = (0, 1)
    ANNUL = (1, 1)
    EXALT = (2, 1)

    def __new__(cls, a, cost):
        entry = object.__new__(cls)
        entry._value_ = a
        entry.cost = cost
        return entry

    def __repr__(self):
        return f'<{type(self).__name__}.{self.name}: ({self._value_!r}, {self.cost!r})>'
