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
const jwtHelper_1 = require("../helpers/jwtHelper");
const orders_1 = require("../models/orders");
const ordersDB = new orders_1.Orders_DB();
//////////////////////Index Mehtod///////////////////////////////////////
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, jwtHelper_1.Verify)(req);
        const orders = yield ordersDB.index();
        res.json(orders);
    }
    catch (err) {
        const e = err;
        if (e.message.includes('Failed to get the orders')) {
            res.status(500).json(e.message);
        }
        else {
            res.status(401).json(e.message);
        }
    }
});
//////////////////////GetOne Mehtod///////////////////////////////////////
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, jwtHelper_1.Verify)(req);
        const id = req.params.id;
        const order = yield ordersDB.getOne(id);
        res.send(order);
    }
    catch (error) {
        const e = error;
        if (e.message.includes('Failed to get the order')) {
            res.status(500).json(e.message);
        }
        else {
            res.status(401).json(e.message);
        }
    }
});
//////////////////////Current Order Mehtod///////////////////////////////////////
const currentOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, jwtHelper_1.Verify)(req);
        const orderId = req.body.id;
        const userId = req.body.userId;
        const order = yield ordersDB.currentOrder(orderId, userId);
        res.send(order);
    }
    catch (error) {
        const e = error;
        if (e.message.includes('Failed to get the current order')) {
            res.status(500).json(e.message);
        }
        else {
            res.status(401).json(e.message);
        }
    }
});
//////////////////////Create Mehtod///////////////////////////////////////
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        (0, jwtHelper_1.Verify)(req);
        const order = {
            d_date: req.body.d_date,
            n_total_price: req.body.n_total_price,
            s_user_id: req.body.s_user_id,
            b_status: req.body.b_status,
        };
        const orderProducts = (_a = req.body.orderProducts) === null || _a === void 0 ? void 0 : _a.map((orderProduct) => {
            return {
                s_order_id: orderProduct.s_order_id,
                s_product_id: orderProduct.s_product_id,
                n_quantity: orderProduct.n_quantity,
            };
        });
        const newOrder = yield ordersDB.create(order, orderProducts);
        res.json(newOrder);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
//////////////////////Confirm Order Mehtod///////////////////////////////////////
const confirmOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, jwtHelper_1.Verify)(req);
        const { id, s_user_id, b_status } = req.body;
        const editOrder = yield ordersDB.confirmOrder(b_status, id, s_user_id);
        res.send(editOrder);
    }
    catch (error) {
        const e = error;
        if (e.message.includes('Failed to update order status')) {
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
        const deletedOrder = yield ordersDB.delete(id);
        res.send(deletedOrder);
    }
    catch (error) {
        const e = error;
        if (e.message.includes('Failed to delete order')) {
            res.status(500).json(e.message);
        }
        else {
            res.status(401).json(e.message);
        }
    }
});
const orders_routes = (app) => {
    app.get('/orders', index);
    app.get('/orders/:id', getOne);
    app.get('/currentOrder', currentOrder);
    app.post('/orders', create);
    app.patch('/confirmorder', confirmOrder);
    app.delete('/orders', remove);
};
exports.default = orders_routes;
