CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS orders(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    d_date Date NOT NULL,
    n_total_price NUMERIC NOT NULL,
    s_user_id uuid NOT NULL,
    FOREIGN KEY (s_user_id) REFERENCES users (id) ON DELETE CASCADE
);