import gymnasium as gym
from sb3_contrib import MaskablePPO
from sb3_contrib.common.maskable.evaluation import evaluate_policy
from stable_baselines3.common.monitor import Monitor
from stable_baselines3.common.vec_env import SubprocVecEnv

# noinspection PyUnresolvedReferences
from easy_poe.gym.environment.crafting_bench import CraftingBenchEnv

if __name__ == '__main__':
    model_class = MaskablePPO

    env = gym.make("CraftingBench-v0", render_mode="console")
    env = SubprocVecEnv([lambda: Monitor(env) for i in range(1)])

    env.training = False
    env.norm_reward = False

    model = model_class.load("../learner/ppo/ppo_poe", env=env)

    def currency_used(loc, g):
        if loc["done"]:
            print(loc["info"]["currency_used"])


    print(evaluate_policy(model, model.get_env(), n_eval_episodes=10, render=True, use_masking=True,
                          callback=currency_used))
