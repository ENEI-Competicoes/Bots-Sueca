package enei.feature.bot.template.java;

import java.util.Map;
import java.util.HashMap;

public class GameState {
    // Fields for game state
    private boolean gameOver;
    private String currentTurn;
    private Map<String, Integer> roundPoints = new HashMap<>();
    private Map<String, Integer> overallPoints = new HashMap<>();
    private Map<String, String> table = new HashMap<>();
    

    private int playId;

    // Constructor
    public GameState() {
    }

    // Methods for Game Status (Game Over, Current Turn)
    public boolean isGameOver() {
        return gameOver;
    }

    public void setGameOver(boolean gameOver) {
        this.gameOver = gameOver;
    }

    public String getCurrentTurn() {
        return currentTurn;
    }

    public void setCurrentTurn(String currentTurn) {
        this.currentTurn = currentTurn;
    }

    // Methods for Points (Round and Overall)
    public Map<String, Integer> getRoundPoints() {
        return roundPoints;
    }

    public void setRoundPoints(Map<String, Integer> roundPoints) {
        this.roundPoints = roundPoints;
    }

    public Map<String, Integer> getOverallPoints() {
        return overallPoints;
    }

    public void setOverallPoints(Map<String, Integer> overallPoints) {
        this.overallPoints = overallPoints;
    }

    public Map<String, String> getTable() {
        return table;
    }

    public void setTable(Map<String, String> table) {
        this.table = table;
    }

    // Method for Play ID
    public int getPlayId() {
        return playId;
    }

    public void setPlayId(int playId) {
        this.playId = playId;
    }
}