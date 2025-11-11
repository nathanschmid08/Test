import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class ConnectDB {
    private static String URL;
    private static String USER;
    private static String PASSWORD;

    static {
        static {
            Properties properties = new Properties();
            try (java.io.InputStream input = ConnectDB.class.getResourceAsStream("/.env")) {
                if (input != null) {
                    properties.load(input);
                } else {
                    // Fallback: aus Umgebungsvariablen lesen
                    properties.setProperty("MYSQL_DATABASE", System.getenv("MYSQL_DATABASE"));
                    properties.setProperty("MYSQL_USER", System.getenv("MYSQL_USER"));
                    properties.setProperty("MYSQL_PASSWORD", System.getenv("MYSQL_PASSWORD"));
                }
                String databaseName = properties.getProperty("MYSQL_DATABASE");
                USER = properties.getProperty("MYSQL_USER");
                PASSWORD = properties.getProperty("MYSQL_PASSWORD");
                URL = "jdbc:mysql://localhost:3306/" + databaseName;
            } catch (IOException e) {
                System.out.println("Failed to load database credentials: " + e.getMessage());
            }
        }
    }
}