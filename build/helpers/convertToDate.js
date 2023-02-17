"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function convertToDate(str) {
    const date = new Date(str), mnth = ("0" + (date.getMonth() + 1)).slice(-2), day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}
exports.default = convertToDate;
