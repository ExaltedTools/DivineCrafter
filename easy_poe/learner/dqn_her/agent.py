import gymnasium as gym
from stable_baselines3 import DQN, HerReplayBuffer
from stable_baselines3.common.monitor import Monitor
from stable_baselines3.common.vec_env import DummyVecEnv, VecNormalize, VecCheckNan, SubprocVecEnv

import easy_poe.gym.environment.crafting_bench
from easy_poe.gym.wrapper.goal_observation import GoalObservation

if __name__ == '__main__':
    env = SubprocVecEnv([lambda: Monitor(GoalObservation(gym.make("CraftingBench-v0"))) for i in range(8)])
    #env = VecNormalize(env, norm_obs=False, norm_reward=True)
    env = VecCheckNan(env)

    goal_selection_strategy = "future"

    # Instantiate the agent
    model = DQN(
        "MultiInputPolicy",
        env,
        replay_buffer_class=HerReplayBuffer,
        # Parameters for HER
        replay_buffer_kwargs=dict(
            n_sampled_goal=4,
            goal_selection_strategy=goal_selection_strategy,
        ),
        verbose=1)

    model.learn(total_timesteps=int(2e5), progress_bar=True)

    model.save("dqn_poe")
    #env.save("vec_normalize.pkl")
