/***
 * The Ressources class is responsible for handling all communication between the bot and the game server.
 * It provides methods to interact with the game API, including player registration, game state retrieval, card management, and turn handling.
 */

package enei.feature.bot.template.java;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Map;
import java.lang.reflect.Type;
import java.util.HashMap;

public class Ressources {
    private final Gson gson = new Gson();

    // API endpoints
    private final String REGISTER_URL = "http://server:5000/register";
    private final String GAME_STATE_URL = "http://server:5000/get_gamestate";
    private final String PLAYER_CARDS_URL = "http://server:5000/get_player_cards";
    private final String PLAYER_TURN_URL = "http://server:5000/get_player_turn";
    private final String PLAY_CARD_URL = "http://server:5000/play_card";

    // --- Helper method to send HTTP requests ---
    private String sendRequest(String urlStr, String method, String body) throws IOException {
        HttpURLConnection connection = (HttpURLConnection) new URL(urlStr).openConnection();
        connection.setRequestMethod(method);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);

        if (body != null) {
            try (OutputStream os = connection.getOutputStream()) {
                os.write(body.getBytes("utf-8"));
            }
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            return response.toString();
        }
    }
    // ------

    // --- Methods for Game State Management ---
    public void updateGameState(String token, String playerId, GameState gameState) throws IOException {
        String response = sendRequest(GAME_STATE_URL, "POST", createJsonBody(token, playerId));
        Map<String, Object> data = parseJson(response);

        gameState.setGameOver((Boolean) data.getOrDefault("game_over", false));
        gameState.setCurrentTurn((String) data.getOrDefault("current_turn", ""));
        gameState.setPlayId(((Number) data.getOrDefault("play_id", 0)).intValue());

        if (data.containsKey("overall_points")) {
            gameState.setOverallPoints(extractPoints(data.get("overall_points")));
        }

        if (data.containsKey("round_points")) {
            gameState.setRoundPoints(extractPoints(data.get("round_points")));
        }

        if (data.containsKey("table")) {
            gameState.setTable(extractTable(data.get("table")));
        }
    }

    private Map<String, Integer> extractPoints(Object pointsData) {
        Map<String, Integer> points = new HashMap<>();
        if (pointsData instanceof Map<?, ?>) {
            for (Map.Entry<?, ?> entry : ((Map<?, ?>) pointsData).entrySet()) {
                if (entry.getKey() instanceof String && entry.getValue() instanceof Number) {
                    points.put((String) entry.getKey(), ((Number) entry.getValue()).intValue());
                }
            }
        }
        return points;
    }

    private Map<String, String> extractTable(Object tableData) {
        Map<String, String> table = new HashMap<>();
        if (tableData instanceof Map<?, ?>) {
            for (Map.Entry<?, ?> entry : ((Map<?, ?>) tableData).entrySet()) {
                if (entry.getKey() instanceof String && entry.getValue() instanceof String) {
                    table.put((String) entry.getKey(), ((String) entry.getValue()));
                }
            }
        }
        return table;
    }
    // ------

    // --- Methods for Player Management ---
    public String registerPlayer(String playerId, String name) throws IOException {
        String response = sendRequest(REGISTER_URL, "POST",
                String.format("{\"player_id\": \"%s\", \"name\": \"%s\"}", playerId, name));
        var data = parseJson(response);
        return (String) data.get("token");
    }

    public List<String> getCards(String token, String playerId) throws IOException {
        String response = sendRequest(PLAYER_CARDS_URL, "POST", createJsonBody(token, playerId));
        var data = parseJson(response);
        return (List<String>) data.get("cards");
    }
    // ------

    // --- Methods for Card Play and Turn Management ---
    public void playCard(String token, String playerId, String card) throws IOException {
        String jsonBody = String.format("{\"token\": \"%s\", \"player_id\": \"%s\", \"card\": \"%s\"}",
                token, playerId, card);
        String response = sendRequest(PLAY_CARD_URL, "POST", jsonBody);
        System.err.println(response);
    }

    public String waitForTurn() throws InterruptedException, IOException {
        String response = sendRequest(PLAYER_TURN_URL, "GET", null);
        var data = parseJson(response);
        return (String) data.get("player");
    }
    // ------

    // --- Helper Methods for JSON Parsing and Request Creation ---
    private Map<String, Object> parseJson(String json) {
        Type type = new TypeToken<Map<String, Object>>() {
        }.getType();
        return gson.fromJson(json, type);
    }

    private String createJsonBody(String token, String playerId) {
        return String.format("{\"token\": \"%s\", \"player_id\": \"%s\"}", token, playerId);
    }
    // ------
}