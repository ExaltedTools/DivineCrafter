import gymnasium as gym
import numpy as np
import torch
import torch.nn.functional as F
import easy_poe.gym.env.crafting_bench

from gymnasium.wrappers import FlattenObservation
from torch import nn

from easy_poe.learner.dqn.DQN import DQN
from easy_poe.poe.currency import Currency


if __name__ == '__main__':
    env = FlattenObservation(gym.make('CraftingBench-v0', render_mode="ansi"))
    device = torch.device("cuda")

    n_actions = env.action_space.n
    # Get the number of state observations
    state, info = env.reset()
    n_observations = len(state)

    model = torch.load("learner/dqn/policy_net")
    policy_net = DQN(n_observations, n_actions).to(device)
    policy_net.load_state_dict(model.state_dict())

    done = False
    cost = 0
    while not done:
        state_tensor = torch.tensor(state, dtype=torch.float32, device=device).unsqueeze(0)
        with torch.no_grad():
            action = policy_net(state_tensor).max(1)[1].view(1, 1).item()

        print("Previous item: {0}".format(env.from_multi_hot(state[:env.modifiers_count])))

        observation, reward, terminated, truncated, info = env.step(action)

        print("Currency used: {0}".format(Currency(action)))
        print(env.render())
        print()

        state = observation
        done = terminated or truncated
        cost += reward

    print(cost)
