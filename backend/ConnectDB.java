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
        Properties properties = new Properties();
        try (FileInputStream input = new FileInputStream("C:/Users/N.Schmid.inf24/Desktop/Test/backend/.env")) {
            properties.load(input);
            String databaseName = properties.getProperty("MYSQL_DATABASE");
            USER = properties.getProperty("MYSQL_USER");
            PASSWORD = properties.getProperty("MYSQL_PASSWORD");
            URL = "jdbc:mysql://localhost:3306/" + databaseName;
        } catch (IOException e) {
            System.out.println("Failed to load database credentials: " + e.getMessage());
        }
    }
}