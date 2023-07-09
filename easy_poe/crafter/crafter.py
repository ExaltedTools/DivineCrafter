import gymnasium as gym
from sb3_contrib import TRPO
from sb3_contrib.common.maskable.utils import get_action_masks
from stable_baselines3.common.evaluation import evaluate_policy
from stable_baselines3.common.monitor import Monitor
from stable_baselines3.common.vec_env import SubprocVecEnv, VecNormalize

import easy_poe.gym.environment.crafting_bench

if __name__ == '__main__':
    model_class = TRPO

    env = SubprocVecEnv([lambda: Monitor(gym.make("CraftingBench-v0", render_mode="console")) for i in range(1)])
    #env = VecNormalize.load("vec_normalize.pkl", env)

    env.training = False
    env.norm_reward = False

    model = model_class.load("../learner/trpo/trpo_poe", env=env)

    print(evaluate_policy(model, model.get_env(), n_eval_episodes=1000, render=True))

