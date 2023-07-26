import numpy as np
from gymnasium import ObservationWrapper
from gymnasium.spaces import Dict, Box

from easy_poe.poe.item.item import Item


class OneHotObservation(ObservationWrapper):

    def __init__(self, env):
        super().__init__(env)
        self.observation_space = Dict(
            {
                "current_item": Box(0, 1, (Item.MAX_AFFIXES + 1, self.modifiers_count + 1), dtype=np.float64),
                "target_item": Box(0, 1, (Item.MAX_AFFIXES + 1, self.modifiers_count + 1), dtype=np.float64)
            }
        )

    def observation(self, obs):
        self.observation_space.sample()
        return {
            "current_item": self._item_to_one_hot(obs["current_item"]),
            "target_item": self._item_to_one_hot(obs["target_item"])
        }

    def _item_to_one_hot(self, item):
        return np.eye(self.modifiers_count + 1, dtype=np.float64)[item.astype(np.int32)]
