"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSercice = void 0;
const axios_1 = __importDefault(require("axios"));
const buffer_1 = require("buffer");
const mpesa_config_1 = require("../../config/mpesa.config");
class AuthSercice {
    static accessTokenData = {
        access_token: "",
        expires_at: 0,
    };
    static async getAuth() {
        const consumerSecret = mpesa_config_1.config.consumerSecret;
        const consumerKey = mpesa_config_1.config.consumerKey;
        if (mpesa_config_1.url.authUrl == null || mpesa_config_1.url.authUrl === undefined)
            throw new Error("Auth url missing");
        const authUrl = mpesa_config_1.url.authUrl;
        const buffer = buffer_1.Buffer.from(`${consumerKey}:${consumerSecret}`);
        const auth = buffer.toString("base64");
        try {
            const tokenReq = await axios_1.default.get(authUrl, {
                headers: {
                    authorization: `Basic ${auth}`,
                },
            });
            const access_token = tokenReq.data.access_token;
            const expiresIn = parseInt(tokenReq.data.expires_in);
            const expires_at = Date.now() + expiresIn * 1000;
            this.accessTokenData = { access_token, expires_at };
            return access_token;
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    static async getAccessToken() {
        if (this.isTokenExpired()) {
            return await this.getAuth();
        }
        else {
            return this.accessTokenData.access_token;
        }
    }
    static isTokenExpired() {
        return this.accessTokenData.expires_at < Date.now();
    }
}
exports.AuthSercice = AuthSercice;
