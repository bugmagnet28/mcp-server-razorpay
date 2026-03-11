import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { razorpay } from "../client.js";

export function registerPaymentTools(server: McpServer) {
  server.registerTool(
    "fetch_payment",
    {
      title: "Fetch Payment",
      description: "Fetch details of a specific Razorpay payment by payment ID.",
      inputSchema: {
        payment_id: z
          .string()
          .describe("Razorpay Payment ID (e.g. pay_xxxxxx)"),
      },
    },
    async ({ payment_id }) => {
      try {
        const res = await razorpay.get(`/payments/${payment_id}`);
        return {
          content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }],
        };
      } catch (err: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.response?.data?.error?.description || err.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "capture_payment",
    {
      title: "Capture Payment",
      description:
        "Capture an authorized Razorpay payment. Amount must match the original order amount in paise.",
      inputSchema: {
        payment_id: z.string().describe("Razorpay Payment ID to capture"),
        amount: z.number().int().positive().describe("Amount in paise to capture"),
        currency: z.string().default("INR"),
      },
    },
    async ({ payment_id, amount, currency }) => {
      try {
        const res = await razorpay.post(`/payments/${payment_id}/capture`, {
          amount,
          currency,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }],
        };
      } catch (err: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.response?.data?.error?.description || err.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "list_payments",
    {
      title: "List Payments",
      description: "List Razorpay payments with optional filters.",
      inputSchema: {
        count: z.number().int().min(1).max(100).default(10),
        skip: z.number().int().min(0).default(0),
        from: z.number().int().optional().describe("Unix timestamp filter start"),
        to: z.number().int().optional().describe("Unix timestamp filter end"),
      },
    },
    async (params) => {
      try {
        const res = await razorpay.get("/payments", { params });
        return {
          content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }],
        };
      } catch (err: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${err.response?.data?.error?.description || err.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
