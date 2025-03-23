#ifndef COMMUNICATOR
#define COMMUNICATOR

using namespace std;
#include <iostream>

#include "structs.h"
#include <curl/curl.h>
#include "json.hpp"

using json = nlohmann::json;

class Communicator {
    public:
        Communicator(); // Constructor
        // ~Communicator(); // Destructor

        void get_identification(Identification &identification);
        void get_gamestate(Gamestate &gamestate, Identification &identification);
        void get_cards(vector<string> &cards, Identification &identification);
        void get_player_turn(string &player_turn);
        void play_card(string &card, Identification &identification, Gamestate &gamestate);

    private:
};

#endif
