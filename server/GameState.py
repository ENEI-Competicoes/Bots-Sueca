import json
from datetime import datetime, timedelta
from player import *
import random
from config import *

class GameState:
    def __init__(self):
        self.game_ended = False
        self.game_start_time = datetime.now()
        self.play_id = 1
        self.trump_suit = ""
        self.round_starting_player = ROUND_STARTING_PLAYER
        self.player_turn_num = None
        self.player_turn = None
        self.starting_player = 1
        self.table = {
            "P1": "",
            "P2": "",
            "P3": "",
            "P4": ""
        }
        self.round_points = {
            "1": 0,
            "2": 0
        }
        self.overall_points = {
            "1": 0,
            "2": 0
        }
        self.players = [Player(i+1) for i in range(4)]
        self.renounce = {
            "P1": False,
            "P2": False,
            "P3": False,
            "P4": False
        }
        self.renounce_counts = {
            "P1": 0,
            "P2": 0,
            "P3": 0,
            "P4": 0
        }

    # Utility Methods
    def to_dict(self):
        """Returns the current game state as a dictionary."""
        return {
            "game_over": self.game_ended,
            "game_start_time": self.game_start_time.isoformat(),
            "play_id": self.play_id,
            "trump_suit": self.trump_suit,
            "table": self.table,
            "round_points": self.round_points,
            "overall_points": self.overall_points,
        }

    def log_table(self):
        message = f"""Table:
    P1: {self.table["P1"]} 
    P2: {self.table["P2"]} 
    P3: {self.table["P3"]} 
    P4: {self.table["P4"]} 
        """
        self.write_to_logs(message)

    def reset_game_state(self):
        """Resets the relevant game state attributes."""
        self.round_points = {"1": 0, "2": 0}
        self.table = {"P1": "", "P2": "", "P3": "", "P4": ""}
        self.game_ended = False

    def log_game_end(self, winning_team: str, losing_team: str):
        """Logs the result of the game."""
        with open("/logs/logs.txt", "a") as file:
            file.write(f"Winning team: {winning_team}, Losing team: {losing_team}\n")

    def reset_table(self):
        """Resets table; removes every card played."""
        self.table = {key: "" for key in self.table}

    def reset_round_points(self):
        """Resets round points."""
        self.round_points = {"1": 0, "2": 0}

    def increment_play(self):
        self.play_id += 1

    # Game State Updates
    def deal_cards(self, starting_player: int):
        """Deals cards to players and sets the trump suit."""
        deck = cards.copy()
        for i in range(NUM_PLAYERS):
            current_player = starting_player + i
            if current_player > NUM_PLAYERS:
                current_player -= NUM_PLAYERS

            random_cards = random.sample(deck, 10)

            if i == 0:
                self.trump_suit = random_cards[0][0]

            for card in random_cards:
                deck.remove(card)

            self.players[current_player-1].cards = random_cards

    def add_round_points(self, team: str, points: int):
        """Adds points to the round winning team."""
        if team in self.round_points:
            self.round_points[team] += points

    def add_overall_points(self, team: str, points: int):
        """Adds points to a team."""
        if team in self.overall_points:
            self.overall_points[team] += points

    def update_table(self, player_id: str, card: str):
        """Updates table with newly played card."""
        if player_id in self.table:
            self.table[player_id] = card

    def validate_renounce(self, accusation: str) -> bool:
        self.game_ended = True

        accused_player = "P"+str(accusation[1])
        accused_team = self.get_team_from_player(accused_player)
        accusing_team = "1" if accused_team == "2" else "2"

        is_valid = self.renounce[accused_player]
        if is_valid:
            self.round_points[accused_team] = 0
            self.round_points[accusing_team] = 120
            return True
        else:
            self.round_points[accused_team] = 120
            self.round_points[accusing_team] = 0
            return False


    # Game Conditions
    def check_if_game_ended(self):
        """Checks if the game has ended due to reasons like timeout or other conditions."""
        if self.game_ended:
            return True
        if self.has_time_exceeded(max_duration=3600) or self.overall_points["1"] >= 10 or self.overall_points["2"] >= 10:
            return True
        return False

    def is_round_over(self, max_points: int = 90):
        """Checks if the round is over."""
        return any(points >= max_points for points in self.round_points.values())

    def has_time_exceeded(self, max_duration: int):
        """Checks if the game has exceeded the max duration."""
        return datetime.now() > self.game_start_time + timedelta(seconds=max_duration)

    # Player and Team Handling
    def get_team_from_player(self, player_id: str) -> str:
        """Returns the team of the player."""
        return "1" if int(player_id[1]) % 2 != 0 else "2"

    def find_player(self, player_id: str):
        """Finds a player by their ID."""
        for player in self.players:
            if player.id == player_id:
                return player

    # Timeout and Renounce Handling
    def end_round_due_to_timeout(self, player_id: str):
        """Ends the game due to timeout by determining the winning and losing team."""
        losing_team = self.get_team_from_player(player_id)
        winning_team = "1" if losing_team == "2" else "2"

        self.round_points[winning_team] = 120
        self.round_points[losing_team] = 0
        self.end_game()

        self.log_game_end(winning_team, losing_team)

    def check_for_renounce(self, player_id: str, leading_suit: str):
        """Checks for renounce when a player doesn't follow the leading suit."""
        hand = self.find_player(player_id).cards
        global renounce

        for card in hand:
            if card[0] == leading_suit:
                self.write_to_logs(f"    {player_id} did a renounce, the leading suit was: {leading_suit} and they had: {card}")
                self.renounce[player_id] = True
                return

    def reset_renounce(self):
        self.renounce = {
            "P1": False,
            "P2": False,
            "P3": False,
            "P4": False
        }

    @staticmethod
    def compare_cards(card1, card2) -> bool:
        """Returns True if, for the same suit, card1 wins over card2."""
        global card_order
        return card_order.index(card1[1:]) < card_order.index(card2[1:])
    
    @staticmethod
    def write_to_logs(message: str):
        with open("/logs/logs.txt", "a") as file:
            file.write(message + "\n")

    def get_table_state(self, player: str):
        """Returns the present game state."""
        return self.table.get(player, "")

    def get_round_points(self, team: str):
        """Returns round points for the specified team."""
        return self.round_points.get(team, 0)

    def get_overall_points(self, team: str):
        """Returns overall round points for a specific team."""
        return self.overall_points.get(team, 0)

    def end_game(self):
        """Ends the game."""
        self.game_ended = True

    def calculate_round_starting_player(self):
        if self.round_starting_player < NUM_PLAYERS:
            self.round_starting_player += 1
        else: 
            self.round_starting_player = 1
    
    def get_trump_winning_player(self, table, trump_suit) -> str | None:
        """Returns the winning player if any trump card was played. If no trump card was played, then this returns None."""
        winning_player = None
        highest_trump_card = None
        # go through each player card pair on the table
        for player, card in table.items():
            # check if its a trump and compare with any previously found trump card
            if card.startswith(trump_suit) and (highest_trump_card is None or self.compare_cards(card, highest_trump_card)):
                winning_player = player
                highest_trump_card = card
        return winning_player

    
    def calculate_player_turn(self, j:int):
        self.player_turn_num = self.starting_player + j
        if self.player_turn_num > NUM_PLAYERS:
            self.player_turn_num -= NUM_PLAYERS
        self.player_turn = "P" + str(self.player_turn_num)

        self.write_to_logs("Its "+ self.player_turn + "'s turn")
    
    def evaluate_play(self):
        table :dict = self.table

        # if game_state.starting_player not in table.keys() or not table[game_state.starting_player]:
        #     return False, {"error": "game_state.starting_player is not valid or has not played any card in the round"}

        self.log_table()

        leading_player = "P"+str(self.starting_player)
        leading_card = table[leading_player]    
        leading_suit = leading_card[0]
        
        # check if anyone won through trumps
        winning_player = self.get_trump_winning_player(table, self.trump_suit)

        if winning_player is None:  # No trump played
            winning_player = None
            winning_card = None
            # go through each player card pair on the table
            for player, card in table.items():
                if card.startswith(leading_suit):
                    if winning_card is None or self.compare_cards(card, winning_card):
                        winning_card = card
                        winning_player = player

        # winning player is now the new starting player
        self.starting_player = int(winning_player[1])
        self.write_to_logs("Winning Player:" + winning_player)

        # calculate the winning team
        winning_team = "1" if winning_player in ["P1", "P3"] else "2"

        # sum the card points on the table
        round_points = sum(card_points[card[1]] for card in table.values())
        self.add_round_points(winning_team, round_points)

        # check for any renounces
        self.write_to_logs("Checking for renounces:") 
        for player, card in table.items():
            if not card.startswith(leading_suit):
                self.check_for_renounce(player, leading_suit)
        self.write_to_logs(" ")

        #clear the table
        self.reset_table()
    
    # finish a round and see who won
    def evaluate_round(self):
        
        winning_team = ""
        
        # Check if there's a tie
        if self.get_round_points(TEAM_1) == self.get_round_points(TEAM_2):
            # Reset play_id if it's a tie
            self.play_id = 1
            # No one wins points
            self.reset_round_points()
            return
        
        # check who won
        if self.get_round_points(TEAM_1) > self.get_round_points(TEAM_2):
            winning_team = TEAM_1
        else:
            winning_team = TEAM_2

        self.write_to_logs(f"\nTEAM {winning_team} WON!")
        self.write_to_logs(f"    They scored {self.round_points[winning_team]} points.")
        
        # Calculate how many points the winning team will earn
        if self.get_round_points(winning_team) == MAX_ROUND_POINTS:
            self.add_overall_points(winning_team, ROUND_WON_WITH_MAX_POINTS)
        elif self.get_round_points(winning_team) > ROUND_POINTS_THRESHOLD:
            self.add_overall_points(winning_team, ROUND_WON_WITH_MORE_THAN_THRESHOLD)
        else:
            self.add_overall_points(winning_team, ROUND_WON_WITH_LESS_THAN_THRESHOLD)

        self.write_to_logs("    Overall Points:")
        self.write_to_logs(f"        1: {self.overall_points["1"]}")
        self.write_to_logs(f"        2: {self.overall_points["2"]}")

        # Reset play_id and round points
        self.play_id = 1
        self.reset_round_points()
        self.game_ended = False
    
    def reset_renounce_counts(self):
        self.renounce_counts = {
            "P1": 0,
            "P2": 0,
            "P3": 0,
            "P4": 0
        }