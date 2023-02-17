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
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = require("../models/products");
const jwtHelper_1 = require("../helpers/jwtHelper");
const productsDB = new products_1.Products_DB();
//////////////////////Index Mehtod///////////////////////////////////////
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, jwtHelper_1.Verify)(req);
    const products = yield productsDB.index();
    res.json(products);
});
//////////////////////GetOne Mehtod///////////////////////////////////////
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, jwtHelper_1.Verify)(req);
        const id = req.params.id;
        const product = yield productsDB.getOne(id);
        res.send(product);
    }
    catch (error) {
        const e = error;
        if (e.message.includes('Failed to get the product')) {
            res.status(500).json(e.message);
        }
        else {
            res.status(401).json(e.message);
        }
    }
});
//////////////////////Create Mehtod///////////////////////////////////////
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, jwtHelper_1.Verify)(req);
        const product = {
            s_name: req.body.s_name,
            s_description: req.body.s_description,
            n_price: req.body.n_price,
        };
        const newProduct = yield productsDB.create(product);
        res.json(newProduct);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
//////////////////////Update Mehtod///////////////////////////////////////
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, jwtHelper_1.Verify)(req);
        const { id, s_name, s_description, n_price } = req.body;
        const product = { id, s_name, s_description, n_price };
        const editProduct = yield productsDB.update(product);
        res.send(editProduct);
    }
    catch (error) {
        const e = error;
        if (e.message.includes('Failed to update product')) {
            res.status(500).json(e.message);
        }
        else {
            res.status(401).json(e.message);
        }
    }
});
//////////////////////Delete Mehtod///////////////////////////////////////
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, jwtHelper_1.Verify)(req);
        const id = req.body.id;
        const deletedProduct = yield productsDB.delete(id);
        res.send(deletedProduct);
    }
    catch (error) {
        const e = error;
        if (e.message.includes('Failed to delete product')) {
            res.status(500).json(e.message);
        }
        else {
            res.status(401).json(e.message);
        }
    }
});
const products_routes = (app) => {
    app.get('/products', index);
    app.get('/products/:id', getOne);
    app.post('/products', create);
    app.put('/products', update);
    app.delete('/products', remove);
};
exports.default = products_routes;
