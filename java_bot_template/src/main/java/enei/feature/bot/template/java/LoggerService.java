/***
 * Simple logger service to track the bot game play
 */

package enei.feature.bot.template.java;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class LoggerService {
    private static final String LOG_FILE = "/logs/logs.txt";
    private static final Logger logger = Logger.getLogger(LoggerService.class.getName());

    public void log(String message) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(LOG_FILE, true))) {
            writer.write(message + "\n");
        } catch (IOException e) {
            logger.log(Level.SEVERE, "Failed to write to log file", e);
        }
    }

    public void clearLogs() {
        try (FileWriter writer = new FileWriter(LOG_FILE, false)) { // Overwrite the file
            // Writing nothing clears the file
        } catch (IOException e) {
            logger.log(Level.SEVERE, "Failed to clear log file", e);
        }
    }
}