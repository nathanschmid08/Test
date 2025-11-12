/*

+────────┌────────┌──────────┌─────────────┌────────────────┌──────────┌──────────────┌───────────────┌─────────────────+
|USER_ID |COMP_ID |USER_ABBR |USER_SURNAME |USER_FIRST_NAME |USER_ROLE |USER_PASSWORD |USER_JOIN_DATE |USER_UPDATE_DATE |
+────────└────────└──────────└─────────────└────────────────└──────────└──────────────└───────────────└─────────────────+
USER_ID             INT             AUTO_INCREMENT                          PRIMARY KEY,
COMP_ID             INT             FOREIGN KEY REFERENCES COMPANY(COMP_ID),
USER_ABBR           VARCHAR(5)      NOT NULL,
USER_SURNAME        VARCHAR(100)    NOT NULL,
USER_FIRST_NAME     VARCHAR(100)    NOT NULL,
USER_ROLE           VARCHAR(50)     NOT NULL,
USER_PASSWORD       VARCHAR(255)    NOT NULL,
USER_JOIN_DATE      DATETIME        DEFAULT CURRENT_TIMESTAMP
USER_UPDATE_DATE    DATETIME        DEFAULT NULL                            ON UPDATE CURRENT_TIMESTAMP

*/

CREATE TABLE USERS (
    USER_ID             INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
    COMP_ID             INT             NOT NULL,
    USER_ABBR           VARCHAR(5)      NOT NULL,
    USER_SURNAME        VARCHAR(100)    NOT NULL,
    USER_FIRST_NAME     VARCHAR(100)    NOT NULL,
    USER_ROLE           VARCHAR(50)     NOT NULL,
    USER_PASSWORD       VARCHAR(255)    NOT NULL,
    USER_JOIN_DATE      DATETIME        DEFAULT CURRENT_TIMESTAMP,
    USER_UPDATE_DATE    DATETIME        DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (COMP_ID) REFERENCES COMPANY(COMP_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;