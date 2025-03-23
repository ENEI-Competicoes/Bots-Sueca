# config.py

import os
from datetime import datetime

NUM_PLAYERS = 4
MAX_ROUND_POINTS = 120
ROUND_POINTS_THRESHOLD = 90
ROUND_WON_WITH_MAX_POINTS = 4
ROUND_WON_WITH_MORE_THAN_THRESHOLD = 2
ROUND_WON_WITH_LESS_THAN_THRESHOLD = 1

STARTING_PLAYER = 1
ROUND_STARTING_PLAYER = 1

EMPTY_CARD = ""
LOG_FILE_PATH = "/logs/logs.txt"
PLAYER_IDS = [f"P{i}" for i in range(1, NUM_PLAYERS + 1)]
TEAM_1 = "1"
TEAM_2 = "2"

MAX_GAME_DURATION = int(os.getenv("MAX_GAME_DURATION", 5 * 60))
game_start_time = None

TOKENS = {
    "P1": "",
    "P2": "",
    "P3": "",
    "P4": ""
}

cards = ['EA', 'E7', 'EK', 'EJ', 'EQ', 'E6', 'E5', 'E4', 'E3', 'E2', 'CA', 'C7', 'CK', 'CJ', 'CQ', 'C6', 'C5', 'C4', 'C3', 'C2', 'PA', 'P7', 'PK', 'PJ', 'PQ', 'P6', 'P5', 'P4', 'P3', 'P2', 'OA', 'O7', 'OK', 'OJ', 'OQ', 'O6', 'O5', 'O4', 'O3', 'O2']

card_points = {
    'A': 11, '7': 10, 'K': 4, 'J': 3, 'Q': 2,
    '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '8': 0, '9': 0, '10': 0
}

card_order = ['A', '7', 'K', 'J', 'Q', '6', '5', '4', '3', '2']

renounce_counts = {
    "P1": 0,
    "P2": 0,
    "P3": 0,
    "P4": 0
}

STARTING_PLAYER = 1
ROUND_STARTING_PLAYER = 1
