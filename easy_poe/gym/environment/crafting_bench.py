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
        self._current_item: Item = Item(Rarity.NORMAL)
        self._target_item: Item = Item(Rarity.RARE)

        self._currency_list = np.array([Transmute, Alteration, Augmentation, Regal, Alchemy, Chaos, Exalted, Scour, Annul])
        self._currency_used = None

        self.modifiers_count = len(Modifier)

        self.observation_space = Dict(
            {
                "current_item": Box(0, self.modifiers_count, (Item.MAX_AFFIXES + 1,), dtype=np.float64),
                "target_item": Box(0, self.modifiers_count, (Item.MAX_AFFIXES + 1,), dtype=np.float64)
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

        self._currency_used = dict.fromkeys(self._currency_list, 0)

        obs = self._get_obs()
        info = self._get_info()

        return obs, info

    def step(self, action):
        currency: Currency = self._currency_list[action]

        if currency.can_apply_to(self._current_item):
            currency.apply_to(self._current_item)

        self._currency_used[currency] += 1

        obs = self._get_obs()
        info = self._get_info()

        reward = float(self.compute_reward(obs["current_item"], obs["target_item"], None))
        terminated = (reward == 0)

        return obs, reward, terminated, False, info

    def compute_reward(self, current_item, target_item, info):
        ci_set = set(current_item)
        ti_set = set(target_item)
        distance = 1.0 - len(ci_set.intersection(ti_set)) / len(ci_set.union(ti_set))
        return -distance

    def action_masks(self):
        masks = np.empty((len(self._currency_list),), dtype=bool)
        for idx, x in enumerate(self._currency_list):
            masks[idx] = x.can_apply_to(self._current_item)

        return masks

    def _get_obs(self):
        return {
            "current_item": self._item_to_obs(self._current_item),
            "target_item": self._item_to_obs(self._target_item)
        }

    def _get_info(self):
        return {
            "current_item": self._current_item,
            "target_item": self._target_item,
            "currency_used": self._currency_used
        }

    def _item_to_obs(self, item):
        rarity = 0
        if item.rarity is Rarity.NORMAL:
            rarity = 0
        elif item.rarity is Rarity.MAGIC:
            rarity = 1
        elif item.rarity is Rarity.RARE:
            rarity = 2

        return np.append(item.affixes, rarity).astype(np.float64)

    def render(self):
        print("Current item affixes: {0}".format(np.sort(self._current_item.affixes)))
        print("Current item rarity: {0}".format(self._current_item.rarity.name))

        print("Target item affixes: {0}".format(np.sort(self._target_item.affixes)))
        print("Target item rarity: {0}".format(self._target_item.rarity.name))

        print()

    def close(self):
        pass
