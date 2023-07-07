import gymnasium as gym
import numpy as np
from gymnasium import spaces
from gymnasium.spaces import Dict, Box

from easy_poe.poe.currency.alchemy import Alchemy
from easy_poe.poe.currency.alteration import Alteration
from easy_poe.poe.currency.annul import Annul
from easy_poe.poe.currency.augmentation import Augmentation
from easy_poe.poe.currency.chaos import Chaos
from easy_poe.poe.currency.currency import Currency
from easy_poe.poe.currency.exalted import Exalted
from easy_poe.poe.currency.regal import Regal
from easy_poe.poe.currency.scour import Scour
from easy_poe.poe.currency.transmute import Transmute
from easy_poe.poe.item.item import Item, Rarity
from easy_poe.poe.item.modifier import Modifier


class CraftingBenchEnv(gym.Env):
    metadata = {"render_modes": ["console"]}

    def __init__(self, render_mode=None):
        self.modifiers_count = len(Modifier)
        self.min_mod_id = 0
        self.max_mod_id = self.modifiers_count

        self._current_item: Item = Item(Rarity.NORMAL)
        self._target_item: Item = Item(Rarity.RARE)
        self._currency_list = np.array([Transmute, Alteration, Augmentation, Regal, Alchemy, Chaos, Exalted, Scour, Annul])

        self.observation_space = Dict(
                {
                    "observation": Box(0, 1, (self.modifiers_count + 3,), dtype=np.float64),
                    "achieved_goal": Box(0, 1, (self.modifiers_count + 3,), dtype=np.float64),
                    "desired_goal": Box(0, 1, (self.modifiers_count + 3,), dtype=np.float64)
                }
            )
        self.action_space = spaces.Discrete(len(self._currency_list))

        assert render_mode is None or render_mode in self.metadata["render_modes"]
        self.render_mode = render_mode

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)

        self._current_item = Item(Rarity.NORMAL)
        self._target_item = Item(Rarity.RARE)
        Chaos.apply_to(self._target_item)

        obs = self._get_obs()
        info = self._get_info()

        return obs, info

    def step(self, action):
        currency: Currency = self._currency_list[action]

        if currency.can_apply_to(self._current_item):
            currency.apply_to(self._current_item)

        obs = self._get_obs()
        info = self._get_info()

        reward = float(self.compute_reward(obs["achieved_goal"], obs["desired_goal"], None).item())
        terminated = (reward == 0)

        return obs, reward, terminated, False, info

    def compute_reward(self, achieved_goal, desired_goal, info):
        distance = np.linalg.norm(achieved_goal - desired_goal, axis=-1)
        return -(distance > 0).astype(np.float32)

    def action_masks(self):
        masks = np.empty((len(self._currency_list),), dtype=bool)
        for idx, x in enumerate(self._currency_list):
            masks[idx] = x.can_apply_to(self._current_item)

        return masks

    def _get_obs(self):
        return {
            "observation": self._item_to_multi_hot(self._current_item),
            "achieved_goal": self._item_to_multi_hot(self._current_item),
            "desired_goal": self._item_to_multi_hot(self._target_item)
        }

    def _get_info(self):
        return {
            "current_item": self._current_item,
            "target_item": self._target_item
        }

    def _item_to_multi_hot(self, item):
        multi_hot_item = np.zeros(self.modifiers_count)
        for i in np.nditer(item.affixes):
            if i == 0:
                continue
            multi_hot_item[i - 1] = 1

        multi_hot_rarity = np.zeros(3)
        if item.rarity is Rarity.NORMAL:
            multi_hot_rarity[0] = 1
        elif item.rarity is Rarity.MAGIC:
            multi_hot_rarity[1] = 1
        elif item.rarity is Rarity.RARE:
            multi_hot_rarity[2] = 1

        return np.concatenate((multi_hot_item, multi_hot_rarity))

    def render(self):

        print("Current item affixes: {0}".format(np.sort(self._current_item.affixes)))
        print("Current item rarity: {0}".format(self._current_item.rarity.name))

        print("Target item affixes: {0}".format(np.sort(self._target_item.affixes)))
        print("Target item rarity: {0}".format(self._target_item.rarity.name))

        print()

    def close(self):
        pass
