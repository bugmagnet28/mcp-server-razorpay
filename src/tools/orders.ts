import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { razorpay } from "../client.js";

export function registerOrderTools(server: McpServer) {
  server.registerTool(
    "create_order",
    {
      title: "Create Order",
      description:
        "Create a new Razorpay order. Amount must be in paise (e.g. 50000 = ₹500).",
      inputSchema: {
        amount: z.number().int().positive().describe("Amount in paise"),
        currency: z.string().default("INR").describe("Currency code e.g. INR"),
        receipt: z
          .string()
          .max(40)
          .optional()
          .describe("Receipt ID for your reference"),
        notes: z
          .record(z.string())
          .optional()
          .describe("Key-value notes (max 15 pairs)"),
      },
    },
    async ({ amount, currency, receipt, notes }) => {
      try {
        const res = await razorpay.post("/orders", {
          amount,
          currency,
          receipt,
          notes,
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
    "fetch_order",
    {
      title: "Fetch Order",
      description: "Fetch details of a specific Razorpay order by order ID.",
      inputSchema: {
        order_id: z.string().describe("Razorpay Order ID (e.g. order_xxxxxx)"),
      },
    },
    async ({ order_id }) => {
      try {
        const res = await razorpay.get(`/orders/${order_id}`);
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
    "list_orders",
    {
      title: "List Orders",
      description: "List Razorpay orders with optional filters.",
      inputSchema: {
        count: z
          .number()
          .int()
          .min(1)
          .max(100)
          .default(10)
          .describe("Number of orders to fetch"),
        skip: z.number().int().min(0).default(0).describe("Number of orders to skip"),
        from: z
          .number()
          .int()
          .optional()
          .describe("Unix timestamp - fetch orders created after this"),
        to: z
          .number()
          .int()
          .optional()
          .describe("Unix timestamp - fetch orders created before this"),
        authorized: z
          .boolean()
          .optional()
          .describe("Filter only authorized orders"),
        receipt: z.string().optional().describe("Filter by receipt ID"),
      },
    },
    async (params) => {
      try {
        const res = await razorpay.get("/orders", { params });
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
