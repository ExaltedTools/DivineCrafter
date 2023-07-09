import numpy as np
from gymnasium import ObservationWrapper
from gymnasium.spaces import Dict, Box


class GoalObservation(ObservationWrapper):

    def __init__(self, env):
        super().__init__(env)
        self.observation_space = Dict(
            {
                "observation": Box(0, 1, (self.modifiers_count + 3,), dtype=np.float64),
                "achieved_goal": Box(0, 1, (self.modifiers_count + 3,), dtype=np.float64),
                "desired_goal": Box(0, 1, (self.modifiers_count + 3,), dtype=np.float64)
            }
        )

    def observation(self, obs):
        return {
            "observation": obs["current_item"],
            "achieved_goal": obs["current_item"],
            "desired_goal": obs["target_item"],
        }
    