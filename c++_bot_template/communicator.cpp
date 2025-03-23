#include "communicator.h"


Communicator::Communicator() {
}

const string GET_TURN_URL = "http://server:5000/get_player_turn";
const string PLAY_CARD_URL = "http://server:5000/play_card";

size_t WriteCallback(void* contents, size_t size, size_t nmemb, string* output) {
    size_t totalSize = size * nmemb;
    output->append((char*)contents, totalSize);
    return totalSize;
}

void Communicator::get_identification(Identification &identification){
    CURL* curl = curl_easy_init();
    
    if(curl) {
        // define the URL for the request
        curl_easy_setopt(curl, CURLOPT_URL, "http://server:5000/register");

        // set as POST request
        curl_easy_setopt(curl, CURLOPT_POST, 1L);

        // set identification in post json
        json json_obj = {
            {"name", "C++"},
            {"player_id", identification.player_id}
        };
        string json_data = json_obj.dump();
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data.c_str());

        struct curl_slist* headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        // define the callback function to store the response
        string response_data;
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response_data);

        // perform the request
        CURLcode res = curl_easy_perform(curl);

        if(res != CURLE_OK) {
            cerr << "Request failed: " << curl_easy_strerror(res) << "\n";
        } else {
            try {
                json j = json::parse(response_data);
                j.at("token").get_to(identification.token);
            } catch (const json::exception& e) {
                cerr << "JSON parsing failed: " << e.what() << "\n";
            }
        }

        curl_easy_cleanup(curl);
    }
}

void Communicator::get_gamestate(Gamestate &gamestate, Identification &identification){
    CURL* curl = curl_easy_init();
    
    if(curl) {
        // define the URL for the request
        curl_easy_setopt(curl, CURLOPT_URL, "http://server:5000/get_gamestate");

        // set as POST request
        curl_easy_setopt(curl, CURLOPT_POST, 1L);

        // set identification in post json
        json json_obj = {
            {"token", identification.token},
            {"player_id", identification.player_id}
        };
        string json_data = json_obj.dump();
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data.c_str());

        struct curl_slist* headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        // define the callback function to store the response
        string response_data;
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response_data);

        // perform the request
        CURLcode res = curl_easy_perform(curl);

        if(res != CURLE_OK) {
            cerr << "Request failed: " << curl_easy_strerror(res) << "\n";
        } else {
            try {
                json j = json::parse(response_data);
                j.at("play_id").get_to(gamestate.play_id);
                j.at("trump_suit").get_to(gamestate.trump_suit);
                j.at("game_over").get_to(gamestate.game_over);
                j.at("table").get_to(gamestate.table);
                j.at("round_points").get_to(gamestate.round_points);
                j.at("overall_points").get_to(gamestate.overall_points);
            } catch (const json::exception& e) {
                cerr << "JSON parsing failed: " << e.what() << "\n";
            }
        }

        curl_easy_cleanup(curl);
    }
}

void Communicator::get_cards(vector<string> &cards, Identification &identification){
    CURL* curl = curl_easy_init();
    
    if(curl) {
        // define the URL for the request
        curl_easy_setopt(curl, CURLOPT_URL, "http://server:5000/get_player_cards");

        // set as POST request
        curl_easy_setopt(curl, CURLOPT_POST, 1L);

        // set identification in post json
        json json_obj = {
            {"token", identification.token},
            {"player_id", identification.player_id}
        };
        string json_data = json_obj.dump();
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data.c_str());

        struct curl_slist* headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        // define the callback function to store the response
        string response_data;
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response_data);

        // perform the request
        CURLcode res = curl_easy_perform(curl);

        if(res != CURLE_OK) {
            cerr << "Request failed: " << curl_easy_strerror(res) << "\n";
        } else {
            try {
                json j = json::parse(response_data);
                cards.clear();
                j.at("cards").get_to(cards);
            } catch (const json::exception& e) {
                cerr << "JSON parsing failed: " << e.what() << "\n";
            }
        }

        curl_easy_cleanup(curl);
    }
}

void Communicator::get_player_turn(string &player_turn){
    CURL* curl = curl_easy_init();
    
    if(curl) {
        // define the URL for the request
        curl_easy_setopt(curl, CURLOPT_URL, "http://server:5000/get_player_turn");

        // define the callback function to store the response
        string response_data;
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response_data);

        // perform the request
        CURLcode res = curl_easy_perform(curl);

        if(res != CURLE_OK) {
            cerr << "Request failed: " << curl_easy_strerror(res) << "\n";
        } else {
            try {
                json j = json::parse(response_data);
                j.at("player").get_to(player_turn);
            } catch (const json::exception& e) {
                cerr << "JSON parsing failed: " << e.what() << "\n";
            }
        }

        curl_easy_cleanup(curl);
    }
}

void Communicator::play_card(string &card, Identification &identification, Gamestate &gamestate){
    CURL* curl = curl_easy_init();
    
    if(curl) {
        // define the URL for the request
        curl_easy_setopt(curl, CURLOPT_URL, "http://server:5000/play_card");

        // set as POST request
        curl_easy_setopt(curl, CURLOPT_POST, 1L);

        // set identification in post json
        json json_obj = {
            {"token", identification.token},
            {"player_id", identification.player_id},
            {"card", card}
        };
        string json_data = json_obj.dump();
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data.c_str());

        struct curl_slist* headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        // define the callback function to store the response
        string response_data;
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response_data);

        // perform the request
        CURLcode res = curl_easy_perform(curl);

        if(res != CURLE_OK) {
            cerr << "Request failed: " << curl_easy_strerror(res) << "\n";
        } else {
            try {
                json j = json::parse(response_data);
                j.at("play_id").get_to(gamestate.play_id);
                j.at("trump_suit").get_to(gamestate.trump_suit);
                j.at("game_over").get_to(gamestate.game_over);
                j.at("table").get_to(gamestate.table);
                j.at("round_points").get_to(gamestate.round_points);
                j.at("overall_points").get_to(gamestate.overall_points);
            } catch (const json::exception& e) {
                cerr << "JSON parsing failed: " << e.what() << "\n";
            }
        }

        curl_easy_cleanup(curl);
    }
}
