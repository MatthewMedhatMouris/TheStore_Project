CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    s_name VARCHAR(50) NOT NULL,
    s_email VARCHAR(50) UNIQUE NOT NULL,
    s_password VARCHAR(255) NOT NULL
);