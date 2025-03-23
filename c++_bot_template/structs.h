#ifndef STRUCTS
#define STRUCTS

using namespace std;
#include <iostream>
#include <string>
#include <map>

struct Gamestate{
    int play_id;
    string trump_suit;
    bool game_over;
    map<string,string> table;
    map<string,int> round_points;
    map<string,int> overall_points;
};

struct Identification{
    string token;
    string player_id;
};

struct Scores{
    int team_overall_points;
    int enemy_overall_points;
};

#endif