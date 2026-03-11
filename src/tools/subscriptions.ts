import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { razorpay } from "../client.js";

export function registerSubscriptionTools(server: McpServer) {
  server.registerTool(
    "create_subscription",
    {
      title: "Create Subscription",
      description: "Create a recurring subscription for a customer in Razorpay.",
      inputSchema: {
        plan_id: z.string().describe("Razorpay Plan ID (e.g. plan_xxxxxx)"),
        total_count: z
          .number()
          .int()
          .min(1)
          .describe("Total number of billing cycles"),
        quantity: z.number().int().min(1).default(1),
        customer_notify: z
          .number()
          .int()
          .min(0)
          .max(1)
          .default(1)
          .describe("1 = notify customer via SMS/email, 0 = silent"),
        start_at: z
          .number()
          .int()
          .optional()
          .describe("Unix timestamp for when subscription starts"),
        notes: z.record(z.string()).optional(),
      },
    },
    async ({ plan_id, total_count, quantity, customer_notify, start_at, notes }) => {
      try {
        const res = await razorpay.post("/subscriptions", {
          plan_id,
          total_count,
          quantity,
          customer_notify,
          start_at,
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
    "fetch_subscription",
    {
      title: "Fetch Subscription",
      description: "Fetch a Razorpay subscription by subscription ID.",
      inputSchema: {
        subscription_id: z
          .string()
          .describe("Razorpay Subscription ID (e.g. sub_xxxxxx)"),
      },
    },
    async ({ subscription_id }) => {
      try {
        const res = await razorpay.get(`/subscriptions/${subscription_id}`);
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
    "cancel_subscription",
    {
      title: "Cancel Subscription",
      description: "Cancel a Razorpay subscription immediately or at end of billing cycle.",
      inputSchema: {
        subscription_id: z.string().describe("Subscription ID to cancel"),
        cancel_at_cycle_end: z
          .number()
          .int()
          .min(0)
          .max(1)
          .default(0)
          .describe("0 = cancel immediately, 1 = cancel at end of current cycle"),
      },
    },
    async ({ subscription_id, cancel_at_cycle_end }) => {
      try {
        const res = await razorpay.post(
          `/subscriptions/${subscription_id}/cancel`,
          { cancel_at_cycle_end }
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
}
