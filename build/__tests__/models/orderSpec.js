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
const database_1 = __importDefault(require("../../database"));
const orders_1 = require("../../models/orders");
const users_1 = require("../../models/users");
const products_1 = require("../../models/products");
const convertToDate_1 = __importDefault(require("../../helpers/convertToDate"));
const userModel = new users_1.Users_DB();
const productModel = new products_1.Products_DB();
const orderModel = new orders_1.Orders_DB();
describe('Test Order Model', () => {
    describe('Check methods in Order Model', () => {
        it('Should have index method to get all orders', () => {
            expect(orderModel.index).toBeDefined();
        });
        it('Should have getOne method to get specific order', () => {
            expect(orderModel.getOne).toBeDefined();
        });
        it('Should have create method to create order', () => {
            expect(orderModel.create).toBeDefined();
        });
        it('Should have delete method to delete order', () => {
            expect(orderModel.delete).toBeDefined();
        });
    });
    describe('Test Order Model Logic', () => {
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
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const currentUser = yield userModel.create(user);
            user.id = currentUser === null || currentUser === void 0 ? void 0 : currentUser.id;
            const currentProduct1 = yield productModel.create(product);
            product.id = currentProduct1.id;
            const currentProduct2 = yield productModel.create(product2);
            product2.id = currentProduct2.id;
            order = {
                d_date: '2021-01-13',
                n_total_price: '6000',
                s_user_id: user.id,
                b_status: false
            };
            const orderProducts = [{
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
        it('Create method return new order', () => __awaiter(void 0, void 0, void 0, function* () {
            const new_order = yield orderModel.create({
                d_date: '2021-01-14',
                n_total_price: '11000',
                s_user_id: user.id,
                b_status: false,
            }, [{
                    s_product_id: product.id,
                    n_quantity: 1,
                }, {
                    s_product_id: product2.id,
                    n_quantity: 1,
                }]);
            new_order.d_date = (0, convertToDate_1.default)(new_order.d_date.toString());
            expect(new_order).toEqual({
                id: new_order.id,
                d_date: '2021-01-14',
                n_total_price: '11000',
                s_user_id: user.id,
                b_status: false,
            });
        }));
        it('Index method return all orders', () => __awaiter(void 0, void 0, void 0, function* () {
            const orderDetails = yield orderModel.index();
            expect(orderDetails.length).toEqual(2);
        }));
        it('GetOne method return specific order', () => __awaiter(void 0, void 0, void 0, function* () {
            const orderDetails = yield orderModel.getOne(order.id);
            orderDetails.d_date = (0, convertToDate_1.default)(orderDetails.d_date.toString());
            expect(orderDetails).toEqual({
                order_id: order.id,
                d_date: '2021-01-13',
                n_total_price: order.n_total_price,
                s_user_name: user.s_name,
                b_status: false,
                productDetails: orderDetails.productDetails,
            });
        }));
        it('CurrentOrder method return specific order depend on user id', () => __awaiter(void 0, void 0, void 0, function* () {
            const orderDetails = yield orderModel.currentOrder(order.id, order.s_user_id);
            orderDetails.d_date = (0, convertToDate_1.default)(orderDetails.d_date.toString());
            expect(orderDetails).toEqual({
                order_id: order.id,
                d_date: '2021-01-13',
                n_total_price: order.n_total_price,
                s_user_name: user.s_name,
                b_status: false,
                productDetails: orderDetails.productDetails,
            });
        }));
        it('ConfirmOrder method will edit the order status from active to complete', () => __awaiter(void 0, void 0, void 0, function* () {
            const orderInfo = yield orderModel.confirmOrder(true, order.id, user.id);
            orderInfo.d_date = (0, convertToDate_1.default)(orderInfo.d_date.toString());
            expect(orderInfo).toEqual({
                id: order.id,
                d_date: '2021-01-13',
                n_total_price: order.n_total_price,
                s_user_id: user.id,
                b_status: true
            });
        }));
        it('Delete method return order which deleted', () => __awaiter(void 0, void 0, void 0, function* () {
            const orderInfo = yield orderModel.delete(order.id);
            orderInfo.d_date = (0, convertToDate_1.default)(orderInfo.d_date.toString());
            expect(orderInfo).toEqual({
                id: order.id,
                d_date: '2021-01-13',
                n_total_price: '6000',
                s_user_id: user.id,
                b_status: orderInfo.b_status,
            });
        }));
    });
});
