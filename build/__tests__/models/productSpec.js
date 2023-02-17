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
const products_1 = require("../../models/products");
const users_1 = require("../../models/users");
const database_1 = __importDefault(require("../../database"));
const userModel = new users_1.Users_DB();
const productModel = new products_1.Products_DB();
describe('Test Product Model', () => {
    describe('Check methods in Product Model', () => {
        it('Should have index method to get all Products', () => {
            expect(productModel.index).toBeDefined();
        });
        it('Should have getOne method to get specific product', () => {
            expect(productModel.getOne).toBeDefined();
        });
        it('Should have create method to create product', () => {
            expect(productModel.create).toBeDefined();
        });
        it('Should have update method to update product', () => {
            expect(productModel.update).toBeDefined();
        });
        it('Should have delete method to delete product', () => {
            expect(productModel.delete).toBeDefined();
        });
    });
    describe('Test Product Model Logic', () => {
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
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const currentUser = yield userModel.create(user);
            user.id = currentUser === null || currentUser === void 0 ? void 0 : currentUser.id;
            const currentProduct = yield productModel.create(product);
            product.id = currentProduct.id;
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const conn = yield database_1.default.connect();
            const sql = `DELETE FROM users;
                  DELETE FROM products;`;
            yield conn.query(sql);
            conn.release();
        }));
        it('Create method return new product', () => __awaiter(void 0, void 0, void 0, function* () {
            const new_product = yield productModel.create({
                s_name: 'Realme',
                s_description: 'testtesttest',
                n_price: 5000,
            });
            expect(new_product).toEqual({
                id: new_product.id,
                s_name: 'Realme',
                s_description: 'testtesttest',
                n_price: '5000.00',
            });
        }));
        it('Index method return all products', () => __awaiter(void 0, void 0, void 0, function* () {
            const products = yield productModel.index();
            expect(products.length).toEqual(2);
        }));
        it('GetOne method return specific product', () => __awaiter(void 0, void 0, void 0, function* () {
            const productInfo = yield productModel.getOne(product.id);
            expect(productInfo).toEqual({
                id: product.id,
                s_name: 'OPPO',
                s_description: 'test test',
                n_price: '6000.00',
            });
        }));
        it('Update method return product which updated', () => __awaiter(void 0, void 0, void 0, function* () {
            const productInfo = yield productModel.update({
                id: product.id,
                s_name: 'Samsung',
                s_description: 'testtesttest',
                n_price: 5000,
            });
            expect(productInfo).toEqual({
                id: product.id,
                s_name: 'Samsung',
                s_description: 'testtesttest',
                n_price: '5000.00',
            });
        }));
        it('Delete method return product which deleted', () => __awaiter(void 0, void 0, void 0, function* () {
            const productInfo = yield productModel.delete(product.id);
            expect(productInfo).toEqual({
                id: product.id,
                s_name: 'Samsung',
                s_description: 'testtesttest',
                n_price: '5000.00',
            });
        }));
    });
});
