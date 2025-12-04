/*
===================================================
This is the SQL File for the SQLite database table.

    For SQLite Web GUI access, follow this link:
        http://localhost:8081/
===================================================
*/

/*

+────────┌─────────────┌───────────────────+
|USER_ID |AVATAR_IMAGE |AVATAR_UPLOAD_DATE |
+────────└─────────────└───────────────────+

USER_ID             INT             NOT NULL,
AVATAR_IMAGE        BLOB            NOT NULL,
AVATAR_UPLOAD_DATE  DATETIME        DEFAULT CURRENT_TIMESTAMP

*/


CREATE TABLE IF NOT EXISTS AVATARS (
    USER_ID             INTEGER         NOT NULL,
    AVATAR_IMAGE        BLOB            NOT NULL,
    AVATAR_UPLOAD_DATE  DATETIME        DEFAULT CURRENT_TIMESTAMP
);