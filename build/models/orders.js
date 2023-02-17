"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders_DB = void 0;
const database_1 = __importDefault(require("../database"));
class Orders_DB {
    //////////////////////Index Mehtod///////////////////////////////////////
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = `Select orders.id as order_id, orders.d_date, orders.n_total_price, products.id as product_id, products.s_name as product_name, products.s_description as description, products.n_price, order_products.n_quantity, users.s_name as user_name from order_products 
                Inner Join orders on order_products.s_order_id = orders.id
                Inner Join products on order_products.s_product_id = products.id
                Inner Join users on orders.s_user_id = users.id`;
                const result = yield conn.query(sql);
                conn.release();
                const data = this.resultData(result.rows);
                return data;
            }
            catch (err) {
                throw new Error(`Cannot get orders ${err}`);
            }
        });
    }
    //////////////////////GetOne Mehtod///////////////////////////////////////
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = `Select orders.id as order_id, orders.d_date, orders.n_total_price, products.id as product_id, products.s_name as product_name, products.n_price, order_products.n_quantity, users.s_name as user_name, orders.b_status from order_products 
            Inner Join orders on order_products.s_order_id = orders.id
            Inner Join products on order_products.s_product_id = products.id
            Inner Join users on orders.s_user_id = users.id where orders.id=($1);`;
                const result = yield connection.query(sql, [id]);
                connection.release();
                const data = this.resultData(result.rows);
                return data[0];
            }
            catch (error) {
                throw new Error(`Failed to get the order with the following error: ${error}`);
            }
        });
    }
    //////////////////////Current Order Mehtod///////////////////////////////////////
    currentOrder(orderId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = `Select orders.id as order_id, orders.d_date, orders.n_total_price, products.id as product_id, products.s_name as product_name, products.n_price, order_products.n_quantity, users.s_name as user_name, orders.b_status from order_products 
            Inner Join orders on order_products.s_order_id = orders.id
            Inner Join products on order_products.s_product_id = products.id
            Inner Join users on orders.s_user_id = users.id where orders.id=($1) and users.id=($2) and orders.b_status=false;`;
                const result = yield connection.query(sql, [orderId, userId]);
                connection.release();
                const data = this.resultData(result.rows);
                return data[0];
            }
            catch (error) {
                throw new Error(`Failed to get the current order with the following error: ${error}`);
            }
        });
    }
    //////////////////////Create Mehtod///////////////////////////////////////
    create(order, orderProducts) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'INSERT INTO orders (d_date,n_total_price,s_user_id) VALUES($1, $2, $3) RETURNING *';
                const result = yield conn.query(sql, [
                    order.d_date,
                    order.n_total_price,
                    order.s_user_id
                ]);
                const order_result = result.rows[0];
                conn.release();
                if (result.rows.length) {
                    orderProducts.forEach((orderProduct) => __awaiter(this, void 0, void 0, function* () {
                        orderProduct.s_order_id = order_result.id;
                        yield this.addProduct(orderProduct);
                    }));
                }
                return order_result;
            }
            catch (err) {
                throw new Error(`Could not add new order. Error: ${err}`);
            }
        });
    }
    //////////////////////AddProduct Mehtod///////////////////////////////////////
    addProduct(orderProduct) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'INSERT INTO order_products (s_order_id, s_product_id, n_quantity) VALUES($1, $2, $3) RETURNING *';
                const result = yield conn.query(sql, [orderProduct.s_order_id, orderProduct.s_product_id, orderProduct.n_quantity]);
                conn.release();
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Could not add product ${orderProduct.s_product_id} to order ${orderProduct.s_order_id}: ${error}`);
            }
        });
    }
    //////////////////////Confirm Order Mehtod///////////////////////////////////////
    confirmOrder(b_status, id, s_user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = 'UPDATE orders SET b_status=($1) WHERE id=($2) and s_user_id=($3) RETURNING *';
                const result = yield connection.query(sql, [b_status, id, s_user_id]);
                connection.release();
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Failed to update order status with the following error: ${error}`);
            }
        });
    }
    //////////////////////Delete Mehtod///////////////////////////////////////
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
                const result = yield connection.query(sql, [id]);
                connection.release();
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Failed to delete order with the following error: ${error}`);
            }
        });
    }
    resultData(data) {
        const result = [];
        data.forEach((order) => {
            const singleOrder = result.find((item) => item.order_id === order.order_id);
            if (!singleOrder) {
                const products = data.filter((item) => item.order_id === order.order_id);
                const productDetails = [];
                products.forEach((product) => {
                    productDetails.push({
                        s_name: product.product_name,
                        n_price: product.n_price,
                        quantity: product.n_quantity
                    });
                });
                result.push({
                    order_id: order.order_id,
                    d_date: order.d_date,
                    n_total_price: order.n_total_price,
                    s_user_name: order.user_name,
                    b_status: order.b_status,
                    productDetails: productDetails,
                });
            }
        });
        return result;
    }
}
exports.Orders_DB = Orders_DB;
