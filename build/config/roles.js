"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRights = exports.roles = void 0;
const allRoles = {
    rental: ["createTool"],
    borrower: ["getUsers", "makePayment"],
};
exports.roles = Object.keys(allRoles);
exports.roleRights = new Map(Object.entries(allRoles));
