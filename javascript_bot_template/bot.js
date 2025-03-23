import fs from 'fs';


let TOKEN = "";
const PLAYER_ID = "P4";
const NAME = "javascript";
const REGISTER_URL = "http://server:5000/register";
const GAMESTATE_URL = "http://server:5000/get_gamestate";
const GET_CARDS_URL = "http://server:5000/get_player_cards";
const GET_TURN_URL = "http://server:5000/get_player_turn";
const PLAY_CARD_URL = "http://server:5000/play_card";

let IDENTIFICATION = {
    "token": "",
    "player_id": ""
};

let CARDS = [];

let TEAM = "";
let ENEMY_TEAM = "";
let TEAM_OVERALL_POINTS = 0;
let ENEMY_OVERALL_POINTS = 0;

let game_state = null;

let play_id = 1;
let turn = "";

const logs = "/logs/logs.txt";

fs.writeFile(logs, "", (err) => {
    if (err) {
        console.error("Error writing to file:", err);
    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function write_to_logs(message){
    fs.appendFile(logs, message + "\n", (err) => {
        if (err) {
            console.error("Error writing to file:", err);
        }
    });
}

function get_teams_from_player(player_id){
    if (Number(player_id[0]) % 2 != 0){
        return ["1","2"];
    }else {
        return ["2","1"];
    }
}

async function register(){
    // pedir dados de registo
    write_to_logs("Trying to register")
    let auth_data = await fetch(REGISTER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"  // Specify that we're sending JSON
        },
        body: JSON.stringify({"player_id":PLAYER_ID, "name":NAME})
    });
    let auth_json = await auth_data.json();
    TOKEN = auth_json["token"];
    if(TOKEN != null){
        write_to_logs("    Token: " + TOKEN)
        write_to_logs("    SUCCESS")
    }
    let teams = get_teams_from_player(PLAYER_ID);
    TEAM = teams[0];
    ENEMY_TEAM = teams[1];

    IDENTIFICATION = {
        "token": TOKEN,
        "player_id": PLAYER_ID
    };
}

async function get_cards(){
    write_to_logs("Fetching new hand...")
    let old_cards = CARDS
    while (CARDS == old_cards || CARDS.length == 0){
        let get_cards_response = await fetch(GET_CARDS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"  // Specify that we're sending JSON
            },
            body: JSON.stringify(IDENTIFICATION)
        });

        try{
            let response_json = await get_cards_response.json();
            CARDS = response_json["cards"]
            
        }catch(err){
            console.log(err)
        }
        sleep(500)
    }
    let my_cards = "";
    for (let card in CARDS){
        my_cards = my_cards + CARDS[card] + " ";
    }
    write_to_logs("    Hand refreshed:\n        " + my_cards + " \n")
}

async function wait_for_turn(){
    write_to_logs("Waiting for my turn...");

    while (turn != PLAYER_ID){
        let turn_data = await fetch(GET_TURN_URL);
        if (turn_data.ok){
            let turn_json = await turn_data.json();
            turn = turn_json["player"];
        }else {
            turn = "";
        }
        await sleep(100);
    }
    write_to_logs("    It's my turn!");
}

async function wait_for_turn_end(){
    write_to_logs("Waiting for turn to end...");
    while (turn == PLAYER_ID){
        let turn_data = await fetch(GET_TURN_URL);
        if (turn_data.ok){
            let turn_json = await turn_data.json();
            turn = turn_json["player"];
        }else {
            turn = "";
        }
        await sleep(100);
    }
    write_to_logs("    Turn is over!")
}

async function wait_for_full_table(){
    write_to_logs("Waiting for full table");
    while (game_state["table"]["P1"] == "" || game_state["table"]["P2"] == "" || game_state["table"]["P3"] == "" || game_state["table"]["P4"] == ""){
        await get_gamestate();
        await sleep(200);
    }
    write_to_logs("    Table is full!")
    write_to_logs("    Table: P1:" + game_state["table"]["P1"] + ", P2:" + game_state["table"]["P2"] + ", P3:" + game_state["table"]["P3"] + ", P4:" + game_state["table"]["P4"] + "\n")
}

async function get_gamestate(){
    let game_state_data = await fetch(GAMESTATE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"  // Ensure the server expects JSON
        },
        body: JSON.stringify(IDENTIFICATION)  // Convert object to JSON string
    });
    game_state = await game_state_data.json();
    return game_state["game_over"];
}

async function play_card(card){
    write_to_logs("Playing card: "+ card)
    let play_card_json = {
        "token": TOKEN,
        "player_id": PLAYER_ID,
        "card": card
    };
    let response = await fetch(PLAY_CARD_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"  // Specify that we're sending JSON
        },
        body: JSON.stringify(play_card_json)
    });
    if (response.ok){
        if (card[0] != "R"){
            write_to_logs("    I played "+ card);
        }else{
            write_to_logs("    I accused P"+ card[1]);
        }
        return true
    }else {
        write_to_logs("    Failed to play "+ card);
        return false
    }
    
}

async function wait_for_round_end(){

    write_to_logs("Waiting for round to end...");

    await get_gamestate();
    play_id = game_state["play_id"];

    while (play_id >= 10){
        await get_gamestate();
        play_id = game_state["play_id"]
        await sleep(100)
    }

    if (game_state["overall_points"][TEAM] != TEAM_OVERALL_POINTS){
        TEAM_OVERALL_POINTS = game_state["overall_points"][TEAM];
        write_to_logs("WE WON!");
    }else{
        ENEMY_OVERALL_POINTS = game_state["overall_points"][ENEMY_TEAM];
        write_to_logs("We lost :(");
    }
    write_to_logs("    Overall Points:")
    write_to_logs("        1: " + game_state["overall_points"]["1"])
    write_to_logs("        2: " + game_state["overall_points"]["2"])
}

function check_win() {
    if (game_state["overall_points"][TEAM] >= 10){
        write_to_logs("WE WON THE GAMEEEEE!");
    }
    else{
        write_to_logs("we lost :(");
    }
}

async function my_main() {

    await sleep(2000);

    await register();

    await get_gamestate();
    
    
    while (game_state["overall_points"]["1"] < 10 && game_state["overall_points"]["2"] < 10){
        write_to_logs("-------------------------------------------------")
        write_to_logs("STARTING A NEW ROUND \n")

        await get_cards();

        await get_gamestate();

        await sleep(0.1);

        write_to_logs("NEW ROUND");

        while (game_state["play_id"] < 10){

            await wait_for_turn();

            await get_gamestate();

            //------------ PLAY A CARD -------------
            let random_card = CARDS[Math.floor(Math.random() * CARDS.length)];
            let success = play_card(random_card);
            //------------- END --------------------

            if(success){
                CARDS = CARDS.filter(item => item !== random_card);
            }

            await wait_for_turn_end();

            await wait_for_full_table();

            //------------- HERE YOU HAVE THE TABLE, might be usefull... --------------------
            //------------- END --------------------

            await get_gamestate();
        }
            
        await wait_for_round_end();
        write_to_logs("\nROUND ENDED\n")
    }

    check_win();
}

my_main()