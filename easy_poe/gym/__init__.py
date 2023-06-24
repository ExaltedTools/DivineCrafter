from gymnasium.envs.registration import register

register(
    id="CraftingBench-v0",
    entry_point="easy_poe.gym.environment:CraftingBenchEnv",
    nondeterministic=True
)
