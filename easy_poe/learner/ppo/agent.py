import gymnasium as gym
from sb3_contrib import MaskablePPO
from stable_baselines3.common.monitor import Monitor
from stable_baselines3.common.vec_env import VecCheckNan, SubprocVecEnv
from torch import nn

from easy_poe.gym.wrapper.ungoal_observation import UngoalObservation

import easy_poe.gym.environment.crafting_bench

if __name__ == '__main__':
    env = SubprocVecEnv([lambda: Monitor(UngoalObservation(gym.make("CraftingBench-v0"))) for i in range(8)])
    env = VecCheckNan(env)

    model = MaskablePPO(
        "MultiInputPolicy",
        env,
        #tensorboard_log="./ppo_tensorboard/",
        batch_size=16,
        n_steps=32,
        n_epochs=1,
        gamma=0.9,
        gae_lambda=0.98,
        learning_rate=0.0009693533106957629,
        ent_coef=0.03711270350288385,
        vf_coef=0.09166171906430953,
        clip_range=0.3,
        max_grad_norm=0.5,
        verbose=1,
        policy_kwargs=dict(activation_fn=nn.Tanh)
    )

    model.learn(total_timesteps=int(2_000_000), progress_bar=True)

    model.save("ppo_poe")
