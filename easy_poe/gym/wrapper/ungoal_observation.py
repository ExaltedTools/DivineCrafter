import numpy as np
from gymnasium import ObservationWrapper
from gymnasium.spaces import Dict, Box


class UngoalObservation(ObservationWrapper):

    def __init__(self, env):
        super().__init__(env)
        self.observation_space = Dict(
                {
                    "current_item": Box(0, 1, (self.modifiers_count,), dtype=np.float64),
                    "target_item": Box(0, 1, (self.modifiers_count,), dtype=np.float64)
                }
            )

    def observation(self, obs):
        return {
            "current_item": obs["observation"],
            "target_item": obs["desired_goal"]
        }
    