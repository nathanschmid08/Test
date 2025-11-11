public class TestConnectDB {
    public static void main(String[] args) {
        try {
            java.sql.Connection conn = ConnectDB.getConnection();
            System.out.println("Connected successfully!");
            conn.close();
        } catch (Exception e) {
            System.out.println("An Error accured while connecting to the database: " + e.getMessage());
        }
    }
}
