"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const StETHRoutes_1 = __importDefault(require("./routes/StETHRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Use the stETHRoutes for any routes starting with /steth
app.use('/steth', StETHRoutes_1.default);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
