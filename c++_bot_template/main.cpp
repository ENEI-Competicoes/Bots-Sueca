#include <iostream>
using namespace std;

#include <string>
#include <map>
#include <vector>
#include <curl/curl.h>
#include "communicator.h"

#include <thread>
#include <chrono>
#include <fstream>

string turn = "";
string PLAYER_ID = "P1";
string TEAM;
string ENEMY_TEAM;

void calculate_team(string &TEAM, string &ENEMY_TEAM, string PLAYER_ID){
    string player_id_num = string() + PLAYER_ID[1]; 
    if(player_id_num=="1" || player_id_num=="3"){
        TEAM = "1";
        ENEMY_TEAM = "2";
    }else{
        TEAM = "2";
        ENEMY_TEAM = "1";
    }
}

bool check_win(Gamestate gamestate, string TEAM){
    if(gamestate.overall_points[TEAM] >= 10){
        cout << "WE WON!" << endl;
        return true;
    }
    cout << "we lost :(" << endl;
    return false;
}

void wait_for_turn(Communicator &communicator, string &turn, Identification &identification){
    while(turn != identification.player_id){
        communicator.get_player_turn(turn);
        this_thread::sleep_for(chrono::milliseconds(100));
    }
}

void wait_for_turn_end(Communicator &communicator, string &turn, Identification &identification){
    while(turn == identification.player_id){
        communicator.get_player_turn(turn);
        this_thread::sleep_for(chrono::milliseconds(100));
    }
}

void wait_for_full_table(Communicator &communicator, Gamestate &gamestate, Identification &identification){
    while(gamestate.table["P1"] == "" || gamestate.table["P2"] == "" || gamestate.table["P3"] == "" || gamestate.table["P4"] == ""){
        communicator.get_gamestate(gamestate, identification);
        if(gamestate.game_over) return;
        this_thread::sleep_for(chrono::milliseconds(100));
    }
}

void wait_for_round_end(Communicator &communicator, Gamestate &gamestate, Identification &identification, Scores &scores, string TEAM, string ENEMY_TEAM){
    while(gamestate.play_id >= 10){
        communicator.get_gamestate(gamestate, identification);
        this_thread::sleep_for(chrono::milliseconds(100));
    }

    if(gamestate.overall_points[TEAM] != scores.team_overall_points){
        // we won
        scores.team_overall_points = gamestate.overall_points[TEAM];
    }else{
        scores.enemy_overall_points = gamestate.overall_points[ENEMY_TEAM];
    }
}

int main() {
    this_thread::sleep_for(chrono::seconds(1));
    Communicator communicator;

    Identification identification;
    identification.player_id = PLAYER_ID;
    calculate_team(TEAM, ENEMY_TEAM, PLAYER_ID);
    
    Gamestate gamestate;
    vector<string> cards;
    Scores scores;
    scores.team_overall_points = 0;
    scores.enemy_overall_points = 0;

    communicator.get_identification(identification);

    communicator.get_gamestate(gamestate, identification);


    while(gamestate.overall_points["1"] < 10 && gamestate.overall_points["2"] < 10 ){
        this_thread::sleep_for(chrono::seconds(1));
        int cards_len = cards.size();
        while(cards_len==cards.size()){
            communicator.get_cards(cards, identification);
        }
        
        cout << cards[0] << endl;

        communicator.get_gamestate(gamestate, identification);

        while(gamestate.play_id < 10){
            wait_for_turn(communicator,turn,identification);

            communicator.get_gamestate(gamestate, identification);

            // ------------- PLAY A CARD --------------
            int random_index = rand() % cards.size();
            string random_card = cards[random_index];
            cards.erase(cards.begin() + random_index);
            communicator.play_card(random_card, identification, gamestate);
            //-------------- END ----------------------

            wait_for_turn_end(communicator, turn, identification);

            wait_for_full_table(communicator, gamestate, identification);
            //------------- HERE YOU HAVE THE TABLE, might be usefull... ----------
            //--------------------------------- END -------------------------------
        }

        wait_for_round_end(communicator,gamestate, identification, scores, TEAM, ENEMY_TEAM);
    }
    check_win(gamestate, TEAM);
    return 0;
}
