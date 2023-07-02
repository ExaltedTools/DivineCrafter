import gymnasium as gym
from stable_baselines3 import DQN, PPO
from stable_baselines3.common.evaluation import evaluate_policy
from stable_baselines3.common.monitor import Monitor
from stable_baselines3.common.vec_env import DummyVecEnv, VecNormalize, SubprocVecEnv

import easy_poe.gym.environment.crafting_bench
from easy_poe.gym.wrapper.ungoal_observation import UngoalObservation

if __name__ == '__main__':
    model_class = PPO

    env = SubprocVecEnv([lambda: Monitor(UngoalObservation(gym.make("CraftingBench-v0", render_mode="console"))) for i in range(8)])
    env = VecNormalize.load("../learner/ppo/vec_normalize.pkl", env)

    env.training = False
    env.norm_reward = False

    model = model_class.load("../learner/ppo/ppo_poe", env=env)

    print(evaluate_policy(model, model.get_env(), n_eval_episodes=1000, render=True))

