import gymnasium as gym
import numpy as np

from gymnasium import spaces
from gymnasium.spaces import MultiBinary

from easy_poe.poe.currency import Currency
from easy_poe.poe.modifier import Modifier


class CraftingBenchEnv(gym.Env):
    metadata = {"render_modes": ["ansi"], "render_fps": 4}

    def __init__(self, render_mode=None, max_modifiers_on_item=6):
        self.max_modifiers_on_item = max_modifiers_on_item
        self.modifiers_count = len(Modifier)
        self.min_mod_id = 0
        self.max_mod_id = self.modifiers_count - 1

        self._current_item = None
        self._target_item = None

        self.observation_space = MultiBinary([2, self.modifiers_count])
        self.action_space = spaces.Discrete(len(Currency))

        assert render_mode is None or render_mode in self.metadata["render_modes"]
        self.render_mode = render_mode

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)

        self._current_item = np.zeros((self.max_modifiers_on_item,), dtype=np.int32)

        self._target_item = self._current_item
        while np.array_equal(self._current_item, self._target_item):
            self._target_item = self.np_random.choice(np.arange(self.min_mod_id, self.max_mod_id),
                                                      size=self.max_modifiers_on_item, replace=False)

        observation = self._get_obs()
        info = self._get_info()

        if self.render_mode == "ansi":
            self.render()

        return observation, info

    def step(self, action):
        action = Currency(action)
        self._current_item = self._apply_currency(self._current_item, action)

        terminated = np.array_equal(np.sort(self._current_item), np.sort(self._target_item))

        observation = self._get_obs()
        info = self._get_info()

        reward = 100 if terminated else -action.cost

        if self.render_mode == "human":
            self.render()

        return observation, reward, terminated, False, info

    def _get_obs(self):
        multi_hot_current = self.to_multi_hot(self._current_item)
        multi_hot_target = self.to_multi_hot(self._target_item)
        return np.array([multi_hot_current, multi_hot_target], dtype=np.int8)

    def _get_info(self):
        return {
            "current_item": self._current_item,
            "target_item": self._target_item
        }

    def get_action_space_mask(self):
        annul = 1
        if np.all(self._current_item == 0):
            annul = 0

        exalt = 1
        if np.all(self._current_item != 0):
            exalt = 0

        return np.array([1, annul, exalt], dtype=np.int8)

    def _apply_currency(self, item, action):
        match action:
            case Currency.ANNUL:
                not_empty_mod_indices = np.where(item != 0)[0]
                if (len(not_empty_mod_indices)) > 0:
                    not_empty_mod_index = self.np_random.choice(not_empty_mod_indices)
                    item[not_empty_mod_index] = 0

            case Currency.CHAOS:
                item = self.np_random.choice(np.arange(self.min_mod_id, self.max_mod_id),
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

    def to_multi_hot(self, item):
        multi_hot = np.zeros(self.modifiers_count, dtype=np.int8)
        for i in np.nditer(item):
            if i == 0:
                continue
            multi_hot[i - 1] = 1
        return multi_hot

    def from_multi_hot(self, item):
        indices = np.where(item != 0)[0] + 1
        pad = self.max_modifiers_on_item - len(indices)
        return np.pad(indices, (pad, 0), 'constant')

    def render(self):
        if self.render_mode == "ansi":
            return "Current item: {0} \nTarget item: {1}".format(np.sort(self._current_item), np.sort(self._target_item))

    def close(self):
        pass
