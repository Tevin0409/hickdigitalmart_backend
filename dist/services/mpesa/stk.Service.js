"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StkService = void 0;
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const auth_1 = require("./auth");
const util_1 = require("../../utils/util");
const mpesa_config_1 = require("../../config/mpesa.config");
const prisma = new client_1.PrismaClient();
exports.StkService = {
    pushStk: async (data) => {
        try {
            if (data.phoneNumber == null || data.phoneNumber.length !== 10)
                throw new Error("Please provide a valid phone Number , 07XXXXXXXX or 01XXXXXXXX");
            if (data.amount == null || data.amount < 1)
                throw new Error("Please provide a valid amount");
            //check if order exist
            const order = await prisma.order.findUnique({
                where: { id: data.orderId },
            });
            if (!order) {
                throw new Error("Order not found ");
            }
            const phoneNumber = data.phoneNumber.substring(1);
            const amount = data.amount;
            const stkUrl = mpesa_config_1.url.stkUrl;
            const shortCode = mpesa_config_1.config.shortcode;
            const passKey = mpesa_config_1.config.passkey;
            const timeStamp = (0, util_1.timestampFn)();
            const buffer = Buffer.from(shortCode + passKey + timeStamp);
            const password = buffer.toString("base64");
            // Token
            const token = await auth_1.AuthSercice.getAccessToken();
            const auth = `Bearer ${token}`;
            const stkRes = await axios_1.default.post(stkUrl, {
                BusinessShortCode: shortCode,
                Password: password,
                Timestamp: timeStamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: amount,
                PartyA: `254${phoneNumber}`,
                PartyB: shortCode,
                PhoneNumber: `254${phoneNumber}`,
                CallBackURL: mpesa_config_1.url.CallBackURL,
                AccountReference: `254${phoneNumber}`,
                TransactionDesc: "test",
            }, {
                headers: {
                    Authorization: auth,
                },
            });
            const stkres = stkRes.data;
            const ResponseCode = stkres.ResponseCode;
            if (ResponseCode === "0") {
                await prisma.transaction.create({
                    data: {
                        merchantRequestID: stkres.MerchantRequestID,
                        checkoutRequestID: stkres.CheckoutRequestID,
                        responseDescription: stkres.ResponseDescription,
                        customerMessage: stkres.CustomerMessage,
                        orderId: data.orderId,
                    },
                });
                return stkres;
            }
            else {
                throw new Error(`Transaction failed with ResponseCode: ${ResponseCode}`);
            }
        }
        catch (err) {
            throw new Error(`Error in pushStk: ${err.message}`);
        }
    },
    queryStk: async (CheckoutRequestID) => {
        try {
            // Check for existing transaction first
            const exisiting = await prisma.transaction.findUnique({
                where: {
                    checkoutRequestID: CheckoutRequestID,
                },
            });
            if (exisiting)
                return exisiting;
            const shortCode = mpesa_config_1.config.shortcode;
            const passKey = mpesa_config_1.config.passkey;
            const queryUrl = mpesa_config_1.url.queryUrl;
            const timeStamp = (0, util_1.timestampFn)();
            const buffer = Buffer.from(shortCode + passKey + timeStamp);
            const password = buffer.toString("base64");
            // Token
            const token = await auth_1.AuthSercice.getAccessToken();
            const auth = `Bearer ${token}`;
            const queryReq = await axios_1.default.post(queryUrl, {
                BusinessShortCode: shortCode,
                Password: password,
                Timestamp: timeStamp,
                CheckoutRequestID,
            }, {
                headers: {
                    Authorization: auth,
                },
            });
            const response = queryReq.data;
            await exports.StkService.saveQuery(response);
            return response;
        }
        catch (err) {
            throw new Error(`Error in queryStk: ${err.message}`);
        }
    },
    saveQuery: async (result) => {
        try {
            const transaction = await prisma.transaction.update({
                where: {
                    checkoutRequestID: result.CheckoutRequestID,
                },
                data: {
                    resultCode: +result.ResultCode,
                    resultDesc: result.ResponseDescription,
                    mpesaReceiptNumber: result.MpesaReceiptNumber,
                },
            });
            if (transaction.mpesaReceiptNumber) {
                await prisma.order.update({
                    where: {
                        id: transaction.orderId,
                    },
                    data: {
                        status: "Paid",
                    },
                });
            }
        }
        catch (err) {
            throw new Error(`Error updating query result: ${err.message}`);
        }
    },
    saveCallbackResult: async (stkCallback) => {
        const ResultCode = stkCallback.ResultCode;
        // const MerchantRequestID = stkCallback.MerchantRequestID
        const CheckoutRequestID = stkCallback.CheckoutRequestID;
        const ResultDesc = stkCallback.ResultDesc;
        if (ResultCode === 0) {
            const amount = stkCallback.CallbackMetadata.Item[0].Value;
            const mpesaReceiptNumber = stkCallback.CallbackMetadata.Item[1].Value;
            const transactionDate = stkCallback.CallbackMetadata.Item[3].Value.toString();
            const phoneNumber = stkCallback.CallbackMetadata.Item[4].Value.toString();
            try {
                const transaction = await prisma.transaction.update({
                    where: {
                        checkoutRequestID: CheckoutRequestID,
                    },
                    data: {
                        resultCode: ResultCode,
                        resultDesc: ResultDesc,
                        mpesaReceiptNumber,
                        amount,
                        phoneNumber,
                        transactionDate,
                    },
                });
                await prisma.order.update({
                    where: {
                        id: transaction.orderId,
                    },
                    data: {
                        status: "Paid",
                    },
                });
            }
            catch (err) {
                throw new Error(err.message);
            }
        }
        else {
            try {
                await prisma.transaction.update({
                    where: {
                        checkoutRequestID: CheckoutRequestID,
                    },
                    data: {
                        resultCode: ResultCode,
                        resultDesc: ResultDesc,
                    },
                });
            }
            catch (err) {
                throw new Error(err.message);
            }
        }
    },
};
