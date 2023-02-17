CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS products(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    s_name VARCHAR(50) UNIQUE NOT NULL,
    s_description VARCHAR(255),
    n_price NUMERIC(17, 2) NOT NULL
);