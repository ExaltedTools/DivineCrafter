import gymnasium as gym
import numpy as np
from gymnasium.wrappers import FlattenObservation

import easy_poe.gym.env.crafting_bench


from easy_poe.poe.modifier import Modifier

env = FlattenObservation(gym.make('CraftingBench-v0', render_mode="ansi"))

if __name__ == '__main__':
    print()
