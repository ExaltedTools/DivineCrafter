from gymnasium.envs.registration import register

register(
    id="CraftingBench-v0",
    entry_point="easy_poe.gym.env:CraftingBenchEnv",
    nondeterministic=True
)
