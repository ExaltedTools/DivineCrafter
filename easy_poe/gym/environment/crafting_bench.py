import gymnasium as gym
import numpy as np
from gymnasium import spaces
from gymnasium.spaces import Dict, Box

from easy_poe.poe.currency import Currency
from easy_poe.poe.modifier import Modifier


class CraftingBenchEnv(gym.Env):
    metadata = {"render_modes": ["console"]}

    def __init__(self, render_mode=None, max_modifiers_on_item=6):
        self.max_modifiers_on_item = max_modifiers_on_item
        self.modifiers_count = len(Modifier)
        self.min_mod_id = 0
        self.max_mod_id = self.modifiers_count

        self._current_item = None
        self._target_item = None

        self.observation_space = Dict(
                {
                    "observation": Box(0, 1, (self.modifiers_count,), dtype=np.float64),
                    "achieved_goal": Box(0, 1, (self.modifiers_count,), dtype=np.float64),
                    "desired_goal": Box(0, 1, (self.modifiers_count,), dtype=np.float64)
                }
            )
        self.action_space = spaces.Discrete(len(Currency))

        assert render_mode is None or render_mode in self.metadata["render_modes"]
        self.render_mode = render_mode

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)

        self._current_item = np.zeros((self.max_modifiers_on_item,), dtype=np.int32)

        self._target_item = self.np_random.choice(np.arange(self.min_mod_id, self.max_mod_id + 1),
                                                  size=self.max_modifiers_on_item,
                                                  replace=False)

        obs = self._get_obs()
        info = self._get_info()

        return obs, info

    def step(self, action):
        action_enum = Currency(action)
        self._current_item = self._apply_currency(self._current_item, action_enum)

        obs = self._get_obs()
        info = self._get_info()

        if self.action_masks()[action]:
            reward = float(self.compute_reward(obs["achieved_goal"], obs["desired_goal"], None).item())
        else:
            reward = -10
        terminated = (reward == 0)

        return obs, reward, terminated, False, info

    def compute_reward(self, achieved_goal, desired_goal, info):
        distance = np.linalg.norm(achieved_goal - desired_goal, axis=-1)
        return -(distance > 0).astype(np.float32)

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

    def action_masks(self):
        annul = False
        if np.any(self._current_item != 0):
            annul = True

        exalt = False
        if np.any(self._current_item == 0):
            exalt = True

        chaos = True

        return np.array([chaos, annul, exalt])

    def _apply_currency(self, item, action):
        match action:
            case Currency.ANNUL:
                not_empty_mod_indices = np.where(item != 0)[0]
                if (len(not_empty_mod_indices)) > 0:
                    not_empty_mod_index = self.np_random.choice(not_empty_mod_indices)
                    item[not_empty_mod_index] = 0

            case Currency.CHAOS:
                item = self.np_random.choice(np.arange(self.min_mod_id, self.max_mod_id + 1),
                                             size=len(item),
                                             replace=False)

            case Currency.EXALT:
                empty_mod_indices = np.where(item == 0)[0]
                if (len(empty_mod_indices)) > 0:
                    empty_mod_index = self.np_random.choice(empty_mod_indices)
                    item[empty_mod_index] = self._get_available_modifiers(item)

        return item

    def _get_available_modifiers(self, item):
        available_modifiers = np.setdiff1d(Modifier.list(), item)
        return self.np_random.choice(available_modifiers)

    def _item_to_multi_hot(self, item):
        multi_hot = np.zeros(self.modifiers_count)
        for i in np.nditer(item):
            if i == 0:
                continue
            multi_hot[i - 1] = 1
        return multi_hot

    def _item_from_multi_hot(self, multi_hot):
        indices = np.where(multi_hot != 0)[0] + 1
        pad = self.max_modifiers_on_item - len(indices)
        return np.pad(indices, (pad, 0), 'constant')

    def render(self):
        print("Current item: {0} \nTarget item: {1}".format(np.sort(self._current_item),
                                                            np.sort(self._target_item)))
        print()

    def close(self):
        pass
