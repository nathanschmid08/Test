/*

+────────┌────────┌──────────┌────────────────┌───────────────┌─────────────────+
|USER_ID |COMP_ID |USER_NAME |USER_FIRST_NAME |USER_JOIN_DATE |USER_UPDATE_DATE |
+────────└────────└──────────└────────────────└───────────────└─────────────────+
USER_ID             INT             AUTO_INCREMENT                          PRIMARY KEY,
COMP_ID             INT             FOREIGN KEY REFERENCES COMPANY(COMP_ID),
USER_NAME           VARCHAR(100)    NOT NULL,
USER_FIRST_NAME     VARCHAR(100)    NOT NULL,
USER_JOIN_DATE      DATETIME        DEFAULT CURRENT_TIMESTAMP
USER_UPDATE_DATE    DATETIME        DEFAULT NULL                            ON UPDATE CURRENT_TIMESTAMP

*/

CREATE TABLE USERS (
    USER_ID             INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    COMP_ID             INT             NOT NULL,
    USER_NAME           VARCHAR(100)    NOT NULL,
    USER_FIRST_NAME     VARCHAR(100)    NOT NULL,
    USER_JOIN_DATE      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    USER_UPDATE_DATE    DATETIME        DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (COMP_ID) REFERENCES COMPANY(COMP_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;