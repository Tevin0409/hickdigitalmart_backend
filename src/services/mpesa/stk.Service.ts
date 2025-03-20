import axios from "axios";
import { PrismaClient } from "@prisma/client";

import { AuthSercice } from "./auth";
import { timestampFn } from "../../utils/util";
import { url, config } from "../../config/mpesa.config";
import { Result } from "../../interface/mpesa";

const prisma = new PrismaClient();

interface stkData {
  phoneNumber: string;
  amount: number;
  orderId: string;
}

export const StkService = {
  pushStk: async (data: stkData): Promise<any> => {
    try {
      if (data.phoneNumber == null || data.phoneNumber.length !== 10)
        throw new Error(
          "Please provide a valid phone Number , 07XXXXXXXX or 01XXXXXXXX"
        );
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

      const stkUrl = url.stkUrl;
      const shortCode = config.shortcode;
      const passKey = config.passkey;
      const timeStamp = timestampFn();

      const buffer = Buffer.from(shortCode + passKey + timeStamp);
      const password = buffer.toString("base64");

      // Token
      const token = await AuthSercice.getAccessToken();
      const auth = `Bearer ${token}`;

      const stkRes = await axios.post(
        stkUrl,
        {
          BusinessShortCode: shortCode,
          Password: password,
          Timestamp: timeStamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: `254${phoneNumber}`,
          PartyB: shortCode,
          PhoneNumber: `254${phoneNumber}`,
          CallBackURL: url.CallBackURL,
          AccountReference: `254${phoneNumber}`,
          TransactionDesc: "test",
        },
        {
          headers: {
            Authorization: auth,
          },
        }
      );

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
      } else {
        throw new Error(
          `Transaction failed with ResponseCode: ${ResponseCode}`
        );
      }
    } catch (err: any) {
      throw new Error(`Error in pushStk: ${err.message}`);
    }
  },

  queryStk: async (CheckoutRequestID: string): Promise<any> => {
    try {
      // Check for existing transaction first
      const exisiting = await prisma.transaction.findUnique({
        where: {
          checkoutRequestID: CheckoutRequestID,
        },
      });

      if (exisiting) return exisiting;

      const shortCode = config.shortcode;
      const passKey = config.passkey;
      const queryUrl = url.queryUrl;
      const timeStamp = timestampFn();

      const buffer = Buffer.from(shortCode + passKey + timeStamp);
      const password = buffer.toString("base64");

      // Token
      const token = await AuthSercice.getAccessToken();
      const auth = `Bearer ${token}`;

      const queryReq = await axios.post(
        queryUrl,
        {
          BusinessShortCode: shortCode,
          Password: password,
          Timestamp: timeStamp,
          CheckoutRequestID,
        },
        {
          headers: {
            Authorization: auth,
          },
        }
      );

      const response = queryReq.data;
      console.log("query response", response);
      await StkService.saveQuery(response);
      return response;
    } catch (err: any) {
      throw new Error(`Error in queryStk: ${err.message}`);
    }
  },

  saveQuery: async (result: Result): Promise<any> => {
    try {
      const transaction = await prisma.transaction.update({
        where: {
          checkoutRequestID: result.CheckoutRequestID,
        },
        data: {
          resultCode: +result.ResultCode,
          resultDesc: result.ResponseDescription,
          mpesaReceiptNumber: result?.MpesaReceiptNumber,
        },
      });
      if (transaction?.mpesaReceiptNumber) {
        await prisma.order.update({
          where: {
            id: transaction.orderId,
          },
          data: {
            status: "Paid",
          },
        });
      }
    } catch (err: any) {
      throw new Error(`Error updating query result: ${err.message}`);
    }
  },
  saveCallbackResult: async (stkCallback: any) => {
    const ResultCode = stkCallback.ResultCode;
    // const MerchantRequestID = stkCallback.MerchantRequestID
    const CheckoutRequestID = stkCallback.CheckoutRequestID;
    const ResultDesc = stkCallback.ResultDesc;

    if (ResultCode === 0) {
      const amount = stkCallback.CallbackMetadata.Item[0].Value;
      const mpesaReceiptNumber = stkCallback.CallbackMetadata.Item[1].Value;
      const transactionDate =
        stkCallback.CallbackMetadata.Item[3].Value.toString();
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
            status: "Awaiting Shipment",
          },
        });
      } catch (err: any) {
        throw new Error(err.message);
      }
    } else {
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
      } catch (err: any) {
        throw new Error(err.message);
      }
    }
  },
};
