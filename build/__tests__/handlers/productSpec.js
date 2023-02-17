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
const request = (0, supertest_1.default)(__1.default);
const userModel = new users_1.Users_DB();
describe('Test Product Endpoint ', () => {
    const user = {
        s_name: 'admin',
        s_email: 'admin@gmail.com',
        s_password: '123',
    };
    let token = '';
    let product_id;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const currentUser = yield userModel.create(user);
        user.id = currentUser === null || currentUser === void 0 ? void 0 : currentUser.id;
        const res = yield request
            .post('/users/authenticate')
            .set('Content-type', 'application/json')
            .send(user);
        token = res.body;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const conn = yield database_1.default.connect();
        const sql = `DELETE FROM users;
            DELETE FROM products;`;
        yield conn.query(sql);
        conn.release();
    }));
    it('Check Product Create Endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .post('/products')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
            s_name: 'OPPO',
            s_description: 'testtest',
            n_price: 5000,
        });
        expect(res.status).toBe(200);
        expect(res.body.s_name).toBe('OPPO');
        product_id = res.body.id;
    }));
    it('Check Product Index Endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .get(`/products`)
            .set('Content-type', 'application/json').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
    }));
    it('Check Product GetOne Endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .get(`/products/${product_id}`)
            .set('Content-type', 'application/json').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.s_name).toBe('OPPO');
    }));
    it('Check Product Update Endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .put(`/products`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
            id: product_id,
            s_name: 'Realme',
            s_description: 'test',
            n_price: 6000
        });
        expect(res.status).toBe(200);
        expect(res.body.s_name).toBe('Realme');
    }));
    it('Check Product Delete Endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .delete(`/products`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
            id: product_id
        });
        expect(res.status).toBe(200);
    }));
});
