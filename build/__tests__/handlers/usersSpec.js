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
describe('Test User Endpoint ', () => {
    const user = {
        s_name: 'admin',
        s_email: 'admin@gmail.com',
        s_password: '123',
    };
    let token = '';
    let user_id;
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
        const sql = `DELETE FROM users;`;
        yield conn.query(sql);
        conn.release();
    }));
    it('Check User Create Endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .post('/users')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
            s_name: 'Matthew',
            s_email: 'matthew@gmail.com',
            s_password: '123',
        });
        expect(res.status).toBe(200);
        expect(res.body.s_name).toBe('Matthew');
        user_id = res.body.id;
    }));
    it('Check User Authenticate Endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .post(`/users/authenticate`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
            s_name: 'Matthew',
            s_email: 'matthew@gmail.com',
            s_password: '123',
        });
        expect(res.status).toBe(200);
    }));
    it('Check User Index Endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .get(`/users`)
            .set('Content-type', 'application/json').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    }));
    it('Check User GetOne Endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .get(`/users/${user_id}`)
            .set('Content-type', 'application/json').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.s_name).toBe('Matthew');
    }));
    it('Check User Update Endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .put(`/users`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
            id: user_id,
            s_name: 'John',
            s_email: 'john@gmail.com',
            s_password: '123'
        });
        expect(res.status).toBe(200);
        expect(res.body.s_name).toBe('John');
    }));
    it('Check User Delete Endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .delete(`/users`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
            id: user_id
        });
        expect(res.status).toBe(200);
    }));
});
