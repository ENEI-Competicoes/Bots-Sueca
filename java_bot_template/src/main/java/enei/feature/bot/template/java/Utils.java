/***
 * This class provides utility methods for handling key game interactions in a card-playing bot. 
 * It serves as an intermediary between the bot logic and the Ressources service, ensuring smooth communication with the game server.
 */

package enei.feature.bot.template.java;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class Utils {

    private final LoggerService loggerService;
    private final Ressources ressources;

    public Utils() {
        this.loggerService = new LoggerService();
        this.ressources = new Ressources();
    }

    // Method to play the chosen card
    public void playCard(String cardToPlay, String token, String playerId) throws IOException {
        loggerService.log("Playing card: " + cardToPlay);
        if (cardToPlay != null) {
            ressources.playCard(token, playerId, cardToPlay);
            loggerService.log("    I played " + cardToPlay);
        } else {
            loggerService.log("    No card to play.");
        }
    }

    // Method to update game state
    public void updateGameState(String token, String playerId, GameState gameState) throws IOException, InterruptedException {
        int attempts = 0;
        while (attempts < 10) {
            try {
                ressources.updateGameState(token, playerId, gameState);
                return;
            } catch (IOException e) {
                loggerService.log("    Failed to update game state, retrying in 5 seconds...");
            }
            attempts++;
            TimeUnit.SECONDS.sleep(1);
        }
        throw new IOException("Failed to update game state after multiple attempts.");
    }

    // Method to refresh the deck of cards
    public List<String> refreshHand(List<String> cards, String token, String playerId) throws IOException, InterruptedException {
        int attempts = 0;
        List<String> oldCards = cards;
        while (attempts < 10) {
            try {
                loggerService.log("Fetching new hand!");
                List<String> newCards = ressources.getCards(token, playerId);

                if (newCards != null && !newCards.isEmpty() && newCards != oldCards) {
                    loggerService.log("    Hand refreshed:\n        " + newCards + "\n");
                    return newCards;
                } else {
                    loggerService.log("    Received empty or null cards. Retrying...");
                }

            } catch (IOException e) {
                loggerService.log("    Failed to fetch cards, retrying...");
            }
            attempts++;
            TimeUnit.SECONDS.sleep(1);
        }
        throw new IOException("    Failed to fetch cards after multiple attempts.");
    }

    // Method to register the player with the server
    public String registerPlayer(String token, String playerId, String name) throws IOException, InterruptedException {
        loggerService.log("Trying to register");
        int attempts = 0;
        while (attempts < 10) {
            try {
                return token = ressources.registerPlayer(playerId, name);

            } catch (IOException e) {
                loggerService.log("Connection failed, retrying in 5 seconds...");
                Thread.sleep(500);
                attempts++;
            }
        }
        throw new IOException("Failed to connect to the server after multiple attempts. Exiting...");
    }

    // Method to wait for the player's turn
    public void waitForTurn(String playerId ,GameState gameState) throws InterruptedException, IOException {
        loggerService.log("Waiting for my turn...");
        int attempts = 0;

        while (attempts < 30) {
            try {
                var playerTurn = ressources.waitForTurn();
                gameState.setCurrentTurn(playerTurn);
                if (playerId.equals(gameState.getCurrentTurn())) {
                    loggerService.log("    It's my turn!");
                    return;
                }
            } catch (IOException e) {
                loggerService.log("    Waiting for my turn...");
            }
            attempts++;
            TimeUnit.SECONDS.sleep(1);
        }
        throw new IOException("    Timed out waiting for turn. Exiting...");
    }

    // Method to wait for the turn to end
    public void waitForTurnEnd(String playerId, GameState gameState) throws InterruptedException, IOException {
        int attempts = 0;
        loggerService.log("Waiting for turn to end...");
        while (playerId.equals(gameState.getCurrentTurn())) {
            var playerTurn = ressources.waitForTurn();
            gameState.setCurrentTurn(playerTurn);

            if (++attempts >= 30) {
                loggerService.log("    Something went wrong!");
                break;
            }
            TimeUnit.SECONDS.sleep(1);
        }
        loggerService.log("    Turn is over!");
    }

    public void waitForFullTable(String token, String playerID, GameState gameState) throws InterruptedException, IOException {
        int attempts = 0;
        loggerService.log("Waiting for full table...");
        while (gameState.getTable().get("P1").equals("") || gameState.getTable().get("P2").equals("") || gameState.getTable().get("P3").equals("") || gameState.getTable().get("P4").equals("")) {
            updateGameState(token, playerID, gameState);
            if (++attempts >= 30) {
                loggerService.log("    Something went wrong!");
                break;
            }
            TimeUnit.SECONDS.sleep(1);
        }
        loggerService.log("    Table is full!");
        loggerService.log("    Table: P1:" + gameState.getTable().get("P1") + ", P2:" + gameState.getTable().get("P2") + ", P3:" + gameState.getTable().get("P3") + ", P4:" + gameState.getTable().get("P4") + "\n");
    }
}
