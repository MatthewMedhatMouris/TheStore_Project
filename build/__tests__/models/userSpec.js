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
const users_1 = require("../../models/users");
const userModel = new users_1.Users_DB();
describe('Test User Model', () => {
    describe('Check methods in User Model', () => {
        it('Should have index method to get all users', () => {
            expect(userModel.index).toBeDefined();
        });
        it('Should have getOne method to get specific users', () => {
            expect(userModel.getOne).toBeDefined();
        });
        it('Should have create method to create user', () => {
            expect(userModel.create).toBeDefined();
        });
        it('Should have update method to update user', () => {
            expect(userModel.update).toBeDefined();
        });
        it('Should have delete method to delete user', () => {
            expect(userModel.delete).toBeDefined();
        });
        it('Should have authenticate method which generate token', () => {
            expect(userModel.authenticate).toBeDefined();
        });
    });
    describe('Test User Model Logic', () => {
        const user = {
            s_name: 'admin',
            s_email: 'admin@gmail.com',
            s_password: '123',
        };
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const currentUser = yield userModel.create(user);
            user.id = currentUser === null || currentUser === void 0 ? void 0 : currentUser.id;
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const conn = yield database_1.default.connect();
            const sql = `DELETE FROM users;`;
            yield conn.query(sql);
            conn.release();
        }));
        it('Authenticate method return user token', () => __awaiter(void 0, void 0, void 0, function* () {
            const userInfo = yield userModel.authenticate(user.s_name, user.s_email, user.s_password);
            expect(userInfo).toEqual({
                id: user.id,
                s_name: 'admin',
                s_email: 'admin@gmail.com',
                s_password: userInfo === null || userInfo === void 0 ? void 0 : userInfo.s_password,
            });
        }));
        it('Create method return new user', () => __awaiter(void 0, void 0, void 0, function* () {
            const new_user = yield userModel.create({
                s_name: 'Matthew',
                s_email: 'matthew@gmail.com',
                s_password: '123',
            });
            expect(new_user).toEqual({
                id: new_user.id,
                s_name: 'Matthew',
                s_email: 'matthew@gmail.com',
            });
        }));
        it('Index method return all users', () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield userModel.index();
            expect(users.length).toEqual(2);
        }));
        it('GetOne method return specific user', () => __awaiter(void 0, void 0, void 0, function* () {
            const userInfo = yield userModel.getOne(user.id);
            expect(userInfo).toEqual({
                id: user.id,
                s_name: 'admin',
                s_email: 'admin@gmail.com',
                s_password: userInfo.s_password,
            });
        }));
        it('Update method return user which updated', () => __awaiter(void 0, void 0, void 0, function* () {
            const userInfo = yield userModel.update({
                id: user.id,
                s_name: 'John',
                s_email: 'john@gmail.com',
                s_password: '123'
            });
            expect(userInfo).toEqual({
                id: user.id,
                s_name: 'John',
                s_email: 'john@gmail.com',
            });
        }));
        it('Delete method return user which deleted', () => __awaiter(void 0, void 0, void 0, function* () {
            const userInfo = yield userModel.delete(user.id);
            expect(userInfo).toEqual({
                id: user.id,
                s_name: 'John',
                s_email: 'john@gmail.com',
            });
        }));
    });
});
