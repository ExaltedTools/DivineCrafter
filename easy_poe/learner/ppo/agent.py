import gymnasium as gym
from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import DummyVecEnv, VecNormalize, VecCheckNan, VecEnv, VecEnvWrapper, \
    SubprocVecEnv
from easy_poe.gym.wrapper.ungoal_observation import UngoalObservation

import easy_poe.gym.environment.crafting_bench

if __name__ == '__main__':
    env = SubprocVecEnv([lambda: UngoalObservation(gym.make("CraftingBench-v0")) for i in range(8)])
    env = VecCheckNan(VecNormalize(env, norm_obs=False, norm_reward=True,
                                   clip_obs=10.))

    model = PPO(
        "MultiInputPolicy",
        env,
        batch_size=256,
        n_steps=128,
        n_epochs=1,
        gamma=0.9,
        gae_lambda=0.92,
        learning_rate=0.056226150263782894,
        ent_coef=2.4746152292518316e-08,
        vf_coef=0.3604225938414841,
        clip_range=0.2,
        max_grad_norm=0.9,
        verbose=1
    )

    model.learn(total_timesteps=int(1_000_000), progress_bar=True)

    model.save("ppo_poe")
    env.save("vec_normalize.pkl")
