import gymnasium as gym
import numpy as np

import easy_poe.gym.environment.crafting_bench
from easy_poe.poe.modifier import Modifier

if __name__ == '__main__':
    env = gym.make("CraftingBench-v0")
    distance = np.linalg.norm(np.array([0, 1, 1, 1, 1, 1, 1]) - np.array([1, 1, 1, 1, 1, 0, 0]), axis=-1)
    print(-(distance > 0).astype(np.float32))
