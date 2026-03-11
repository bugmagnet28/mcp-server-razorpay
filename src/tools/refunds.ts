import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { razorpay } from "../client.js";

export function registerRefundTools(server: McpServer) {
  server.registerTool(
    "create_refund",
    {
      title: "Create Refund",
      description:
        "Create a full or partial refund for a Razorpay payment. Omit amount for full refund.",
      inputSchema: {
        payment_id: z.string().describe("Payment ID to refund"),
        amount: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("Amount in paise to refund (omit for full refund)"),
        speed: z
          .enum(["normal", "optimum"])
          .default("normal")
          .describe("Refund speed: normal (5-7 days) or optimum (instant if eligible)"),
        notes: z.record(z.string()).optional(),
        receipt: z.string().optional().describe("Your internal receipt reference"),
      },
    },
    async ({ payment_id, amount, speed, notes, receipt }) => {
      try {
        const res = await razorpay.post(`/payments/${payment_id}/refund`, {
          amount,
          speed,
          notes,
          receipt,
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
    "fetch_refund",
    {
      title: "Fetch Refund",
      description: "Fetch a specific refund by refund ID and payment ID.",
      inputSchema: {
        payment_id: z.string().describe("Payment ID associated with the refund"),
        refund_id: z.string().describe("Refund ID (e.g. rfnd_xxxxxx)"),
      },
    },
    async ({ payment_id, refund_id }) => {
      try {
        const res = await razorpay.get(
          `/payments/${payment_id}/refunds/${refund_id}`
        );
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
    "list_refunds_for_payment",
    {
      title: "List Refunds for Payment",
      description: "List all refunds created for a specific Razorpay payment.",
      inputSchema: {
        payment_id: z.string().describe("Payment ID to list refunds for"),
        count: z.number().int().min(1).max(100).default(10),
        skip: z.number().int().min(0).default(0),
      },
    },
    async ({ payment_id, count, skip }) => {
      try {
        const res = await razorpay.get(`/payments/${payment_id}/refunds`, {
          params: { count, skip },
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
}
