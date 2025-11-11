import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
import java.io.FileInputStream;
import java.io.IOException;

public class ConnectDB {

    private static String URL;
    private static String USER;
    private static String PASSWORD;

    static {
        Properties properties = new Properties();
        try (FileInputStream input = new FileInputStream("main/java/.env")) {
            properties.load(input);
            String databaseName = properties.getProperty("MYSQL_DATABASE");
            USER = properties.getProperty("MYSQL_USER");
            PASSWORD = properties.getProperty("MYSQL_PASSWORD");
            URL = "jdbc:mysql://localhost:3307/" + databaseName;
        } catch (IOException e) {
            System.err.println("Error while loading the .env file: " + e.getMessage());
            // Fallback
            String databaseName = System.getenv("MYSQL_DATABASE");
            USER = System.getenv("MYSQL_USER");
            PASSWORD = System.getenv("MYSQL_PASSWORD");
            if (databaseName == null || USER == null || PASSWORD == null) {
                throw new RuntimeException("Database Configuration missing in .env file or environment variables.");
            }
            URL = "jdbc:mysql://localhost:3306/" + databaseName;
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
