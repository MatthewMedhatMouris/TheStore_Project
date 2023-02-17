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
const supertest_1 = __importDefault(require("supertest"));
const __1 = __importDefault(require("../.."));
const users_1 = require("../../models/users");
const database_1 = __importDefault(require("../../database"));
const products_1 = require("../../models/products");
const orders_1 = require("../../models/orders");
const request = (0, supertest_1.default)(__1.default);
const userModel = new users_1.Users_DB();
const productModel = new products_1.Products_DB();
const orderModel = new orders_1.Orders_DB();
describe('Test Order Endpoint ', () => {
    const user = {
        s_name: 'admin',
        s_email: 'admin@gmail.com',
        s_password: '123',
    };
    const product = {
        s_name: 'OPPO',
        s_description: 'test test',
        n_price: 6000,
    };
    const product2 = {
        s_name: 'Realme',
        s_description: 'test test',
        n_price: 5000,
    };
    let order;
    let orderProducts;
    let token = '';
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield userModel.create(user);
        user.id = currentUser === null || currentUser === void 0 ? void 0 : currentUser.id;
        const res = yield request
            .post('/users/authenticate')
            .set('Content-type', 'application/json')
            .send(user);
        token = res.body;
        const currentProduct1 = yield productModel.create(product);
        product.id = currentProduct1.id;
        const currentProduct2 = yield productModel.create(product2);
        product2.id = currentProduct2.id;
        order = {
            d_date: '2021-01-13',
            n_total_price: '6000',
            s_user_id: user.id,
            b_status: false,
        };
        orderProducts = [{
                s_order_id: order.id,
                s_product_id: product.id,
                n_quantity: 1,
            }];
        const currentOrder = yield orderModel.create(order, orderProducts);
        order.id = currentOrder.id;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const conn = yield database_1.default.connect();
        const sql = `DELETE FROM orders;
                DELETE FROM products;
                DELETE FROM order_products;
                DELETE FROM users;`;
        yield conn.query(sql);
        conn.release();
    }));
    it('Check Orders Create Endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .post('/orders')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
            d_date: '2021-01-13',
            n_total_price: '6000',
            s_user_id: user.id,
            b_status: false,
            orderProducts: [{
                    s_product_id: product.id,
                    n_quantity: 1,
                }, {
                    s_product_id: product2.id,
                    n_quantity: 1,
                }]
        });
        expect(res.status).toBe(200);
        expect(res.body.s_user_id).toBe(user.id);
    }));
    it('Check Order Index Endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .get(`/orders`)
            .set('Content-type', 'application/json').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    }));
    it('Check Order GetOne Endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .get(`/orders/${order.id}`)
            .set('Content-type', 'application/json').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.s_user_name).toBe('admin');
    }));
    it('Check Order CurrentOrder Endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .get(`/currentOrder`)
            .set('Content-type', 'application/json').set('Authorization', `Bearer ${token}`)
            .send({
            "id": order.id,
            "userId": user.id
        });
        expect(res.status).toBe(200);
        expect(res.body.s_user_name).toBe('admin');
    }));
    it('Check Order ConfirmOrder Endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .patch(`/confirmOrder`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
            "id": order.id,
            "s_user_id": user.id,
            "b_status": true
        });
        expect(res.status).toBe(200);
        expect(res.body.b_status).toBe(true);
    }));
    it('Check Order Delete Endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .delete(`/orders`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
            id: order.id
        });
        expect(res.status).toBe(200);
    }));
});
