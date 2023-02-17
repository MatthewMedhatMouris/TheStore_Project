CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS order_products(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    s_order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    s_product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    n_quantity INT NOT NULL
);