import gymnasium as gym
from sb3_contrib import MaskablePPO
from sb3_contrib.common.maskable.utils import get_action_masks
from stable_baselines3.common.monitor import Monitor
from stable_baselines3.common.vec_env import SubprocVecEnv

import easy_poe.gym.environment.crafting_bench
from easy_poe.gym.wrapper.ungoal_observation import UngoalObservation

if __name__ == '__main__':
    model_class = MaskablePPO

    env = SubprocVecEnv([lambda: Monitor(UngoalObservation(gym.make("CraftingBench-v0", render_mode="console"))) for i in range(1)])

    env.training = False

    model = model_class.load("../learner/ppo/ppo_poe", env=env)

    #print(evaluate_policy(model, model.get_env(), n_eval_episodes=1, render=True))

    vec_env = model.get_env()
    obs = vec_env.reset()
    for i in range(1000):
        action_masks = get_action_masks(env)
        action, _states = model.predict(obs, action_masks=action_masks, deterministic=True)
        obs, rewards, dones, info = vec_env.step(action)
        vec_env.render("console")

