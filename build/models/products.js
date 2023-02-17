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
exports.Products_DB = void 0;
const database_1 = __importDefault(require("../database"));
class Products_DB {
    //////////////////////Index Mehtod///////////////////////////////////////
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'Select * from products';
                const result = yield conn.query(sql);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(`Cannot get products ${err}`);
            }
        });
    }
    //////////////////////GetOne Mehtod///////////////////////////////////////
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = 'SELECT * FROM products WHERE id=($1)';
                const result = yield connection.query(sql, [id]);
                connection.release();
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Failed to get the product with the following error: ${error}`);
            }
        });
    }
    //////////////////////Create Mehtod///////////////////////////////////////
    create(product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = 'INSERT INTO products (s_name,s_description,n_price) VALUES($1, $2, $3) RETURNING *';
                const result = yield conn.query(sql, [
                    product.s_name,
                    product.s_description,
                    product.n_price
                ]);
                const product_result = result.rows[0];
                conn.release();
                return product_result;
            }
            catch (err) {
                throw new Error(`Could not add new product. Error: ${err}`);
            }
        });
    }
    //////////////////////Update Mehtod///////////////////////////////////////
    update(product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = 'UPDATE products SET s_name=($1),s_description=($2),n_price=($3) WHERE id=($4) RETURNING *';
                const result = yield connection.query(sql, [product.s_name, product.s_description, product.n_price, product.id]);
                connection.release();
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Failed to update product with the following error: ${error}`);
            }
        });
    }
    //////////////////////Update Mehtod///////////////////////////////////////
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
                const result = yield connection.query(sql, [id]);
                connection.release();
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Failed to delete product with the following error: ${error}`);
            }
        });
    }
}
exports.Products_DB = Products_DB;
