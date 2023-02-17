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
const users_1 = require("../models/users");
const jwtHelper_1 = require("../helpers/jwtHelper");
const users = new users_1.Users_DB();
//////////////////////Index Method/////////////////////////
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, jwtHelper_1.Verify)(req);
        const users_result = yield users.index();
        res.json(users_result);
    }
    catch (err) {
        const e = err;
        if (e.message.includes('Failed to get the users')) {
            res.status(500).json(e.message);
        }
        else {
            res.status(401).json(e.message);
        }
    }
});
////////////////////////GetOne Mehtod////////////////////////////////////
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield users.getOne(id);
        res.send(user);
    }
    catch (error) {
        const e = error;
        if (e.message.includes('Failed to get the user')) {
            res.status(500).json(e.message);
        }
        else {
            res.status(401).json(e.message);
        }
    }
});
////////////////////////Create Mehtod////////////////////////////////////
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, jwtHelper_1.Verify)(req);
        const user = {
            s_name: req.body.s_name,
            s_email: req.body.s_email,
            s_password: req.body.s_password,
        };
        const newUser = yield users.create(user);
        res.json(newUser);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
////////////////////////Update Mehtod////////////////////////////////////
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, jwtHelper_1.Verify)(req);
        const { id, s_name, s_email, s_password } = req.body;
        const user = { id, s_name, s_email, s_password };
        const editUser = yield users.update(user);
        res.send(editUser);
    }
    catch (error) {
        const e = error;
        if (e.message.includes('Failed to update user')) {
            res.status(500).json(e.message);
        }
        else {
            res.status(401).json(e.message);
        }
    }
});
////////////////////////Delete Mehtod////////////////////////////////////
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, jwtHelper_1.Verify)(req);
        const id = req.body.id;
        const deletedUser = yield users.delete(id);
        res.send(deletedUser);
    }
    catch (error) {
        const e = error;
        if (e.message.includes('Failed to delete user')) {
            res.status(500).json(e.message);
        }
        else {
            res.status(401).json(e.message);
        }
    }
});
////////////////////////Authenticate Mehtod////////////////////////////////////
const authenticate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        s_name: req.body.s_name,
        s_email: req.body.s_email,
        s_password: req.body.s_password,
    };
    try {
        const currentUser = yield users.authenticate(user.s_name, user.s_email, user.s_password);
        if (currentUser === null) {
            res.status(401);
            res.json('Incorrect user information');
        }
        else {
            const token = (0, jwtHelper_1.Sign)(currentUser.id);
            res.json(token);
        }
    }
    catch (error) {
        const e = error;
        res.status(401).send(e.message);
    }
});
const users_routes = (app) => {
    app.get('/users', index);
    app.get('/users/:id', getOne);
    app.post('/users', create);
    app.put('/users', update);
    app.delete('/users', remove);
    app.post('/users/authenticate', authenticate);
};
exports.default = users_routes;
