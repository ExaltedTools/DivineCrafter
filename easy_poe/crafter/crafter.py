import gymnasium as gym
from stable_baselines3 import DQN
from stable_baselines3.common.evaluation import evaluate_policy

import easy_poe.gym.environment.crafting_bench

if __name__ == '__main__':
    env = gym.make("CraftingBench-v0", render_mode="ansi")

    model = DQN.load("../learner/dqn_her/dqn_poe", env=env)

    print(evaluate_policy(model, model.get_env(), n_eval_episodes=1000, deterministic=True))

