"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sign = exports.Verify = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
function Verify(req, userId) {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader === null || authorizationHeader === void 0 ? void 0 : authorizationHeader.split(' ')[1];
    const decoded = (0, jsonwebtoken_1.verify)(token, process.env.TOKEN_SECRET);
    if (userId && decoded.user.userId != userId) {
        throw new Error('User id does not match!');
    }
}
exports.Verify = Verify;
function Sign(userId) {
    return (0, jsonwebtoken_1.sign)({ user: { userId } }, process.env.TOKEN_SECRET);
}
exports.Sign = Sign;
