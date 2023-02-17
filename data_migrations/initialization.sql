-- Admin User
INSERT INTO users(id, s_name, s_email, s_password) VALUES ('f67f66df-9234-4347-ab7f-a99b6523c4c3','admin', 'admin@gmail.com', '$2b$10$uD1yZ/KP7Xn6vB4KjMpEke3grxnIlXgzrTukek48uJEDCfopA5waC');

-- Products
INSERT INTO products(id, s_name, s_description, n_price) VALUES ('fc657e89-4861-4c32-8938-a0fd5e752dc2', 'OPPO', 'test', 5000);
INSERT INTO products(id, s_name, s_description, n_price) VALUES ('f11e33d8-52c7-4efa-b9cd-506addefac84', 'Samsung', 'testtest', 6000);


-- Orders
INSERT INTO orders(id, d_date, n_total_price, s_user_id, b_status)
	VALUES ('00dc304d-295d-4823-9384-b491f16cc3e9', '2022-01-15', 11000, 'f67f66df-9234-4347-ab7f-a99b6523c4c3', false);


-- OrderProducts (List of products in the same order)
INSERT INTO order_products(id, s_order_id, s_product_id, n_quantity)
	VALUES ('475d5b79-6421-468c-a967-520996cce3f1', '00dc304d-295d-4823-9384-b491f16cc3e9', 'fc657e89-4861-4c32-8938-a0fd5e752dc2', 1);

INSERT INTO order_products(id, s_order_id, s_product_id, n_quantity)
	VALUES ('06d89216-0432-43fc-a5bc-11dce10fe164', '00dc304d-295d-4823-9384-b491f16cc3e9', 'f11e33d8-52c7-4efa-b9cd-506addefac84', 1);

