CREATE KEYSPACE compage WITH REPLICATION = {'class' : 'SimpleStrategy','replication_factor' : 1};
USE compage;
-- users table
DROP TABLE IF EXISTS compage.users;
CREATE TABLE IF NOT EXISTS compage.users
(
    email      TEXT PRIMARY KEY,
    first_name TEXT,
    last_name  TEXT,
    role       TEXT,
    status     TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
INSERT INTO compage.users (email, first_name, last_name, role, status, created_at, updated_at)
VALUES ('mahendra.b@intelops.dev', 'Mahendra', 'B', 'admin', 'ACTIVE', toTimestamp(now()), toTimestamp(now()));

INSERT INTO compage.users (email, first_name, last_name, role, status, created_at, updated_at)
VALUES ('chandu@intelops.dev', 'Chandrakanth', 'P', 'admin', 'ACTIVE', toTimestamp(now()), toTimestamp(now()));

SELECT *
FROM compage.users;

-- gitPlatforms Table
DROP TABLE IF EXISTS compage.git_platforms;
CREATE TABLE IF NOT EXISTS compage.git_platforms
(
    name                  TEXT,
    url                   TEXT,
    user_name             TEXT,
    personal_access_token TEXT,
    owner_email           TEXT,
    created_at            TIMESTAMP,
    updated_at            TIMESTAMP,
    PRIMARY KEY (name, owner_email)
);

INSERT INTO compage.git_platforms (name, url, user_name, personal_access_token, owner_email, created_at, updated_at)
values ('github', 'https://github.com', 'mahendraintelops', 'ghp_1q2w3e4r5t6y7u8i9o0p', 'mahendra.b@intelops.dev',
        toTimestamp(now()), toTimestamp(now()));
INSERT INTO compage.git_platforms (name, url, user_name, personal_access_token, owner_email, created_at, updated_at)
values ('gitlab', 'https://gitlab.com', 'mahendraintelops', 'ghp_1q2w3e4r5t6y7u8i9o0p', 'mahendra.b@intelops.dev',
        toTimestamp(now()), toTimestamp(now()));

INSERT INTO compage.git_platforms (name, url, user_name, personal_access_token, owner_email, created_at, updated_at)
values ('github', 'https://github.com', 'chanduintelops', 'ghp_1q2w3e4r5t6y7u8i9o0p', 'chandu@intelops.dev', toTimestamp(now()),
        toTimestamp(now()));

select *
from compage.git_platforms;