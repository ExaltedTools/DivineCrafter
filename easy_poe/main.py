import gymnasium as gym
import numpy as np

import easy_poe.gym.environment.crafting_bench
from easy_poe.poe.modifier import Modifier

if __name__ == '__main__':
    env = gym.make("CraftingBench-v0")
    print(env.observation_space.sample())
    print(env.reset())
    print(env.step(2))
