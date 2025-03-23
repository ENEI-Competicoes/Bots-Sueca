/***
 * The Bot class represents an automated game-playing entity.
 * It handles player registration, turn-based gameplay, and strategic decision-making for playing cards.
 */

package enei.feature.bot.template.java;

import java.io.IOException;
import java.util.List;
import java.util.Random;
import java.util.logging.Logger;

public class Bot {
    private static final Logger logger = Logger.getLogger(Bot.class.getName());

    // Dependencies and game state
    private final LoggerService loggerService;
    private final Utils utils;
    private final GameState gameState;
    private List<String> cards;

    // Player info
    private String token;
    private final String playerId = "P2";
    private final String name = "Java";

    // Constructor
    public Bot() {
        this.utils = new Utils();
        this.loggerService = new LoggerService();
        this.gameState = new GameState();
    }

    // Main game loop
    public void start() {
        try {
            loggerService.clearLogs();
            // Register player, initialize game state and retieve player hand
            token = utils.registerPlayer(token, playerId, name);
            loggerService.log("    Token: " + token + "\n    SUCCESS");
            utils.updateGameState(token,playerId,gameState);

            // Main game loop
            while (gameState.getOverallPoints().get("1") < 10 && gameState.getOverallPoints().get("2") < 10) {
                loggerService.log("-------------------------------------------------");
                loggerService.log("STARTING A NEW ROUND \n");

                cards = utils.refreshHand(cards, token, playerId);

                utils.updateGameState(token,playerId,gameState);

                Thread.sleep(100);

                loggerService.log("New Game!");

                while (gameState.getPlayId() <= 10) {
                    if (gameState.isGameOver())
                        break;

                    utils.waitForTurn(playerId,gameState);

                    utils.updateGameState(token,playerId,gameState);

                    String cardToPlay = chooseCard();
                    utils.playCard(cardToPlay,token,playerId);
                    cards.remove(cardToPlay);
                    
                    utils.waitForTurnEnd(playerId,gameState);

                    utils.waitForFullTable(token,playerId,gameState);
                }

                loggerService.log("\nROUND ENDED\n");
            }

            // Game over log
            loggerService.log("Game over!");
        } catch (IOException | InterruptedException e) {
            logger.severe("An error occurred: " + e.getMessage());
        }
    }

    // Method to choose a card
    private String chooseCard() throws IOException, InterruptedException {
        // Ensure that there are cards to choose from
        if (cards == null || cards.isEmpty()) {
            cards = utils.refreshHand(cards, token, playerId);
        }

        return cards.get(new Random().nextInt(cards.size()));
    }

    // Main method to start the bot
    public static void main(String[] args) {
        new Bot().start();
    }
}
