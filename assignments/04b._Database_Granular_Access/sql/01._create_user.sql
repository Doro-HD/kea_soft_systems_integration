-- Initialises the superintendent user

-- Using USER instead of role implies login is possible
CREATE USER anders WITH PASSWORD 'si-04b';

-- Add the newly created user into users
INSERT INTO users (id, name, social_security_number, role) VALUES ('4202265d-40fd-4182-a24c-bfe631313a7d', 'Anders', '000000-0000', 'superintendent');

-- Add the newly created user to db users table
INSERT INTO db_users (id, username, user_id) VALUES ('2e0fac21-4177-4bec-ba22-0f86367a5123', 'anders', '4202265d-40fd-4182-a24c-bfe631313a7d');

-- Provide nessesary grants to the user
GRANT INSERT ON users TO anders;
GRANT UPDATE ("name") ON users TO anders;
GRANT SELECT ON complaints TO anders;