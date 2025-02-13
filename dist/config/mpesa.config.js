"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.url = exports.config = void 0;
const middleware_1 = require("../middleware");
function validateEnvVariable(variable, name) {
    if (variable == null || variable === undefined) {
        throw new middleware_1.AppError(500, `Environment variable ${name} is not defined.`);
    }
    return variable;
}
const config = {
    consumerSecret: validateEnvVariable(process.env.consumerSecret, "consumerSecret"),
    consumerKey: validateEnvVariable(process.env.consumerKey, "consumerKey"),
    shortcode: validateEnvVariable(process.env.shortcode, "shortcode"),
    passkey: validateEnvVariable(process.env.passkey, "passkey"),
};
exports.config = config;
const url = {
    authUrl: validateEnvVariable(process.env.authUrl, "authUrl"),
    stkUrl: validateEnvVariable(process.env.stkUrl, "stkUrl"),
    CallBackURL: validateEnvVariable(process.env.CallBackURL, "CallBackURL"),
    queryUrl: validateEnvVariable(process.env.mpsExpressQueryUrl, "mpsExpressQueryUrl"),
};
exports.url = url;
