import gymnasium as gym
from stable_baselines3 import DQN, HerReplayBuffer
from stable_baselines3.common.evaluation import evaluate_policy
from stable_baselines3.common.vec_env import DummyVecEnv, VecNormalize

import easy_poe.gym.environment.crafting_bench

if __name__ == '__main__':
    env = DummyVecEnv([lambda: gym.make("CraftingBench-v0")])
    env = VecNormalize(env, norm_obs=False, norm_reward=True,
                           clip_obs=10.)

    #env = gym.make("CraftingBench-v0")

    goal_selection_strategy = "final"

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

    # Train the agent and display a progress bar
    model.learn(total_timesteps=int(1_000_000), progress_bar=True)

    # Save the agent
    model.save("dqn_poe")
