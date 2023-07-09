import gymnasium as gym
from sb3_contrib import TRPO
from stable_baselines3.common.monitor import Monitor
from stable_baselines3.common.vec_env import VecCheckNan, SubprocVecEnv, VecNormalize
from torch import nn

import easy_poe.gym.environment.crafting_bench

if __name__ == '__main__':
    env = SubprocVecEnv([lambda: Monitor(gym.make("CraftingBench-v0")) for i in range(8)])
    # env = VecNormalize(env, norm_obs=False, norm_reward=True)
    env = VecCheckNan(env)

    model = TRPO(
        "MultiInputPolicy",
        env,
        verbose=1
    )

    model.learn(total_timesteps=int(2_000_000), progress_bar=True)

    model.save("trpo_poe")
    # env.save("vec_normalize.pkl")