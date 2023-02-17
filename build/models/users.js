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
exports.Users_DB = void 0;
// import { title } from 'process';
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const { PEPPER, SALT_ROUNDS } = process.env;
class Users_DB {
    ///////////////////////Index Method///////////////////////////////
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'Select * from users';
                const result = yield conn.query(sql);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(`Cannot get products ${err}`);
            }
        });
    }
    ////////////////////////GetOne Method/////////////////////////////
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = 'SELECT * FROM users WHERE id=($1)';
                const result = yield connection.query(sql, [id]);
                connection.release();
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Failed to get the user with the following error: ${error}`);
            }
        });
    }
    ////////////////////////Create Method/////////////////////////////
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'INSERT INTO users (s_name, s_email, s_password) VALUES($1, $2, $3) RETURNING id, s_name, s_email';
                const hash = bcrypt_1.default.hashSync(user.s_password + PEPPER, Number(SALT_ROUNDS));
                const result = yield conn.query(sql, [user.s_name, user.s_email, hash]);
                const user_result = result.rows[0];
                conn.release();
                return user_result;
            }
            catch (err) {
                throw new Error(`Could not add new user. Error: ${err}`);
            }
        });
    }
    //////////////////////////Update Method////////////////////////////////////////////////////
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'UPDATE users SET s_name=($1), s_email=($2),s_password=($3) where id=($4) RETURNING id,s_name,s_email';
                const result = yield conn.query(sql, [user.s_name, user.s_email, user.s_password, user.id]);
                conn.release();
                const user_result = result.rows[0];
                return user_result;
            }
            catch (err) {
                throw new Error(`Could not edit user. Error: ${err}`);
            }
        });
    }
    ///////////////////////Delete Method/////////////////////////////////////
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = 'DELETE FROM users WHERE id=($1) RETURNING id,s_name,s_email';
                const result = yield connection.query(sql, [id]);
                connection.release();
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Failed to delete user with the following error: ${error}`);
            }
        });
    }
    ///////////////////////Authenticate Method/////////////////////////////////////
    authenticate(username, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield database_1.default.connect();
            const sql = `SELECT * FROM users WHERE s_name=($1) and s_email=($2);`;
            const result = yield conn.query(sql, [username, email]);
            conn.release();
            if (result.rows.length) {
                const userPass = result.rows[0];
                if (bcrypt_1.default.compareSync(password + PEPPER, userPass.s_password)) {
                    return result.rows[0];
                }
            }
            return null;
        });
    }
}
exports.Users_DB = Users_DB;
