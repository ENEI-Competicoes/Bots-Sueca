import requests
import time
import random

NAME = "python"
PLAYER_ID = "P3"
TOKEN = ""
REGISTER_URL = "http://server:5000/register"
GAMESTATE_URL = "http://server:5000/get_gamestate"
GET_CARDS_URL = "http://server:5000/get_player_cards"
GET_TURN_URL = "http://server:5000/get_player_turn"
PLAY_CARD_URL = "http://server:5000/play_card"

IDENTIFICATION = {
    "token": "",
    "player_id": ""
}

CARDS = []

TEAM = ""
ENEMY_TEAM = ""
TEAM_OVERALL_POINTS = 0
ENEMY_OVERALL_POINTS = 0

game_state = None

play_id = 1
turn = ""

def write_to_logs(message: str):
    with open("/logs/logs.txt", "a") as file:
        file.write(message + "\n")

def get_teams_from_player(player_id):
    if int(player_id[1]) % 2 != 0:
        return ["1","2"]
    else:
        return ["2","1"]
    

    
def register():
    global TOKEN
    global PLAYER_ID
    global TEAM
    global ENEMY_TEAM
    global IDENTIFICATION
    # pedir dados de registo
    register_json = {
        "player_id":PLAYER_ID,
        "name":NAME 
    }
    write_to_logs("Trying to register")
    auth_data = requests.post(REGISTER_URL, json=register_json)
    auth_json = auth_data.json()
    TOKEN = auth_json["token"]
    if TOKEN:
        write_to_logs(f"    Token: {TOKEN}")
        write_to_logs("    SUCCESS")
    teams = get_teams_from_player(PLAYER_ID)
    TEAM = teams[0]
    ENEMY_TEAM = teams[1]

    IDENTIFICATION = {
        "token": TOKEN,
        "player_id": PLAYER_ID
    }

def get_cards():
    global CARDS

    write_to_logs("Fetching new hand...")

    CARDS = []
    while CARDS == []:
        get_cards_response = requests.post(GET_CARDS_URL, json=IDENTIFICATION)
        try:
            CARDS = get_cards_response.json()["cards"]
        except:
            continue

    write_to_logs(f"    Hand refreshed:\n        {CARDS}\n")
    
def wait_for_turn():
    global PLAYER_ID
    global turn

    write_to_logs("Waiting for my turn...")

    while turn != PLAYER_ID:
        turn_data = requests.get(GET_TURN_URL)
        if turn_data.status_code == 200:
            turn_json = turn_data.json()
            turn = turn_json["player"]
        else:
            turn = ""
        time.sleep(0.1)

    write_to_logs("    It's my turn!")

def wait_for_turn_end():
    global PLAYER_ID
    global turn
    write_to_logs("Waiting for turn to end...")
    while turn == PLAYER_ID:
        turn_data = requests.get(GET_TURN_URL)
        turn_json = turn_data.json()
        turn = turn_json["player"]
        time.sleep(0.1)
    write_to_logs("    Turn is over!")

def wait_for_full_table():
    global game_state
    write_to_logs("Waiting for full table...")
    while game_state["table"]["P1"] == "" or game_state["table"]["P2"] == "" or game_state["table"]["P3"] == "" or game_state["table"]["P4"] == "":
        if get_gamestate():
            write_to_logs("    Game is Over!")
            return False
        time.sleep(0.2)
    write_to_logs("    Table is full!")
    write_to_logs(f"    Table: P1:{game_state["table"]["P1"]}, P2:{game_state["table"]["P2"]}, P3:{game_state["table"]["P3"]}, P4:{game_state["table"]["P4"]}\n")
    return True

def get_gamestate() -> bool:
    global game_state

    game_state_data = requests.post(GAMESTATE_URL, json=IDENTIFICATION)
    game_state = game_state_data.json()
    return game_state["game_over"] == True

def play_card(card: str): 
    global CARDS
    global TOKEN
    global PLAYER_ID
    global PLAY_CARD_URL

    play_card_json = {
        "token": TOKEN,
        "player_id": PLAYER_ID,
        "card": card
    }
    write_to_logs(f"Playing card: {card}")
    response = requests.post(PLAY_CARD_URL, json=play_card_json)
    if response.status_code == 200:
        if card[0] != "R":
            CARDS.remove(card)
            write_to_logs("    I played "+ card)
        else:
            write_to_logs("    I accused P"+ card[1])
        
    else:
        write_to_logs("    Failed to play "+ card)
    response_json = response.json()
    return response_json, response.status_code



def wait_for_round_end():
    global game_state
    global play_id
    global TEAM_OVERALL_POINTS
    global ENEMY_OVERALL_POINTS

    write_to_logs("Waiting for round to end...")

    get_gamestate()
    play_id = game_state["play_id"]

    while play_id >= 10:
        get_gamestate()
        play_id = game_state["play_id"]
        time.sleep(0.1)
    write_to_logs("    Round is over!")
    if game_state["overall_points"][TEAM] != TEAM_OVERALL_POINTS:
        TEAM_OVERALL_POINTS = game_state["overall_points"][TEAM]
        write_to_logs("    WE WON!")
    else:
        ENEMY_OVERALL_POINTS = game_state["overall_points"][ENEMY_TEAM]
        write_to_logs("    We lost :(")
    write_to_logs("    Overall Points:")
    write_to_logs(f"        1: {game_state["overall_points"]["1"]}")
    write_to_logs(f"        2: {game_state["overall_points"]["2"]}")

def check_win():
    global game_state

    if game_state["overall_points"][TEAM] >= 10:
        write_to_logs("WE WON THE GAMEEEEE!")
    else:
        write_to_logs("we lost :(")

if __name__ == '__main__':
    with open("/logs/logs.txt", "w") as file:
        file.write("")

    time.sleep(1)

    register()

    get_gamestate()
    
    
    while game_state["overall_points"]["1"] < 10 and game_state["overall_points"]["2"] < 10:
        write_to_logs("-------------------------------------------------")
        write_to_logs("STARTING A NEW ROUND \n")

        get_cards()

        get_gamestate()

        time.sleep(0.1)

        while game_state["play_id"] < 10:

            wait_for_turn()

            get_gamestate()

            #------------ PLAY A CARD -------------
            random_card = random.choice(CARDS)
            response_json, response_code = play_card(random_card)
            #------------- END --------------------
            
            if response_code == 200:
                play_id = response_json["play_id"]
            else:
                write_to_logs(response_json["error"])
                break

            wait_for_turn_end()

            wait_for_full_table()

            #------------- HERE YOU HAVE THE TABLE, might be usefull... --------------------
            #------------- END --------------------

            get_gamestate()
            
        wait_for_round_end()
        write_to_logs("\nROUND ENDED\n")

    check_win()



    


        

