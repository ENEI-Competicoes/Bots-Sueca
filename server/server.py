from flask import Flask, request, jsonify
from flask_cors import CORS
import threading
from datetime import datetime
import time
from uuid import uuid4
from GameState import GameState
from config import *
import random
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

UI_SECRET = os.getenv("UI_SECRET", "default_secret")

game_state = GameState()


def wait_for_bot_registration():
    global TOKENS
    while TOKENS["P1"] == "" or TOKENS["P2"] == "" or TOKENS["P3"] == "" or TOKENS["P4"] == "":
        time.sleep(0.2)
        pass


def write_to_logs(message: str):
    with open("/logs/logs.txt", "a") as file:
        file.write(message + "\n")


# check if the id matches the token
def validate_request(data):

    ui_token = request.headers.get("X-UI-Token")
    if ui_token is not None:
        if ui_token != UI_SECRET:
            return jsonify({"error": "Unauthorized"}), 401
        return True, None
    
    global TOKENS
    # get info from the request
    player_id = data.get("player_id")
    token = data.get("token")

    if player_id not in TOKENS.keys():
        return False, {"error": "Invalid credentials, player not registered. Try again", "playerID": player_id, "token": token}
    if TOKENS[player_id] != token:
        return False, {"error": "Invalid credentials, token is incorrect. Try again", "playerID": player_id, "token": token}
    return True, None
  
@app.route('/get_player_cards', methods=['POST'])
def get_player_cards():
    # validate the request
    # for i in range(4):
    #     print(game_state.players[i].cards)
        
    data = request.get_json()
    #print(data)
    is_valid, error_response = validate_request(data)
    if not is_valid:
        return jsonify(error_response), 400
    else:
        # return the players cards
        return jsonify({"cards": game_state.find_player(data.get("player_id")).cards}), 200


@app.route('/get_player_turn', methods=['GET'])
def get_player_turn():
    # handle the case where game_state.player_turn might not be set
    if game_state.player_turn is None:
        #app.logger.error('Player turn is not set')
        return jsonify({"error": "Player turn not available"}), 400
    
    response = {
        "player": game_state.player_turn
    }
    
    return jsonify(response), 200



@app.route('/get_renounce_counts', methods=['GET'])
def get_renounce_counts():
    ui_token = request.headers.get("X-UI-Token")
    if ui_token != UI_SECRET:
        return jsonify({"error": "Unauthorized"}), 401

    return jsonify(renounce_counts)

@app.route('/register', methods=['POST'])
def register():
    global TOKENS
    global game_state

    data = request.get_json()
    new_ID = data.get("player_id")
    new_name = data.get("name")
    if new_ID == None or new_name == None:
        return jsonify({"error":"Wrong registry params"}), 400
    write_to_logs("Bot " + new_name + " is trying to register as " + new_ID)
    # gerar novo token
    new_token = str(uuid4())
    if TOKENS[new_ID] == "":
        TOKENS[new_ID] = new_token
        write_to_logs("    Token: " + new_token)
    else:
        write_to_logs("    A bot already exists with that ID")
        return jsonify({"error":"Bot already registered with that ID"}), 400
    #criar o json ser devolvido
    new_bot = {
        "player_id": new_ID,
        "token": new_token
    }
    game_state.find_player(new_ID).set_name(new_name)
    if new_bot:
        write_to_logs("    SUCCESS")
        return jsonify(new_bot), 200
    else:
        write_to_logs("    ERROR")
        return jsonify({"error":"Error registering bot"}), 400


@app.route('/play_card', methods=['POST'])
def play_card():
    global game_state
    data = request.get_json()

    # Check if it's the correct player's turn
    if data.get("player_id") != game_state.player_turn:
        return jsonify({"error": "Not your turn"}), 400
    
    # Validate the request data
    is_valid, error_response = validate_request(data)
    if not is_valid:
        return jsonify(error_response), 400

    # Simulate a short delay for gameplay effect
    time.sleep(1)

    player_id = data.get("player_id")
    card = data.get("card")

    # Check if card is null
    if card == None:
        return jsonify({"error": "Card field is empty"}), 400

    # Check if the player has already played a card
    if game_state.table.get(player_id, "") != "":
        return jsonify({"error": "Already played"}), 400

    if card[0] == "R":
        write_to_logs(card + " accusation from " + player_id)
        game_state.table[player_id] = card
        renounce_validity = game_state.validate_renounce(card)
        if renounce_validity:
            write_to_logs("was valid")
            return jsonify(game_state.to_dict()), 200
        else:
            write_to_logs("was invalid")
            return jsonify({"error": "Accusation was invalid"}), 400
    
    # Validate the card played
    if not game_state.find_player(player_id).is_valid_card(card):
        return jsonify({"error": "Invalid card played"}), 400
    
    # Update the table with the played card
    game_state.table[player_id] = card
    
    # Log the card play to a log file
    write_to_logs("    " + player_id + " played " + card)
  
    # Return the updated game state as JSON
    return jsonify(game_state.to_dict()), 200


@app.route('/get_gamestate', methods=['POST'])
def get_gamestate():
    global game_state
    data = request.get_json()

    # Validate the request data
    is_valid, error_response = validate_request(data)
    if not is_valid:
        return jsonify(error_response), 400

    # Check if the game state exists and return it
    if game_state:
        return jsonify(game_state.to_dict()), 200  # Return game state as a dictionary
    else:
        return jsonify({"error": "Error getting game_state"}), 400
    
@app.route('/get_bot_names', methods=['GET'])
def get_bot_names():
    bot_names = {}
    for bot in game_state.players:
        bot_names[bot.id] = bot.name
    return jsonify(bot_names), 200

    
def run_server():
    app.run(host='0.0.0.0', port=5000)

if __name__ == '__main__':
    with open(LOG_FILE_PATH, "w") as file:
        file.write("")
    
    server_thread = threading.Thread(target=run_server)
    server_thread.start()

    wait_for_bot_registration()

    write_to_logs("all bots registered")

    # each iteration is a round
    while game_state.get_overall_points(TEAM_1) < 10 and game_state.get_overall_points(TEAM_2) < 10:
        # Round logic

        write_to_logs("-------------------------------------------------")
        write_to_logs("STARTING A NEW ROUND \n")
        
        # get this round's starting player
        game_state.starting_player = game_state.round_starting_player
        

        game_state.deal_cards(game_state.starting_player)
        write_to_logs("The cards have been dealt\n")
        time.sleep(2.5)
        
        game_state.reset_renounce_counts()

        
        game_state.reset_table()
        while game_state.play_id <= 10:
            
            # THIS IS A PLAY
            
            # Check if the game ended due to reasons such as:
            # - Successful renounce accusation
            # - Timeout (e.g., exceeding max duration)
            # - Reaching the winning conditions (one team has 10 overall points)
            if game_state.check_if_game_ended():             
                break
            
            # ask for cards
            for j in range(4):
                # calculate what player we are going to ask for a card
                game_state.calculate_player_turn(j)
                
                # wait to receive player's card
                while game_state.get_table_state(game_state.player_turn) == "":
                    time.sleep(0.2)

                if game_state.check_if_game_ended():
                    break
            if game_state.check_if_game_ended():
                game_state.player_turn = ""
                game_state.increment_play()
                break

            game_state.player_turn = ""
            time.sleep(1)
            # check who won the play
            game_state.evaluate_play()
            
            # increment the play_id
            game_state.increment_play()

        game_state.evaluate_round()
        game_state.calculate_round_starting_player()
        game_state.reset_renounce()

        write_to_logs("\nROUND ENDED\n")

    write_to_logs("GAME ENDED")