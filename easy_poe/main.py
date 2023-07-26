import gymnasium as gym

from easy_poe.gym.environment import CraftingBenchEnv
from easy_poe.gym.wrapper.onehot_observation import OneHotObservation

if __name__ == '__main__':
    env = OneHotObservation(gym.make("CraftingBench-v0", render_mode="console"))

    print(env.reset())
    env.render()

    print(env.step(0))
    env.render()
