import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { razorpay } from "../client.js";

export function registerPaymentLinkTools(server: McpServer) {
  server.registerTool(
    "create_payment_link",
    {
      title: "Create Payment Link",
      description:
        "Create a shareable Razorpay payment link for a customer. Amount in paise.",
      inputSchema: {
        amount: z.number().int().positive().describe("Amount in paise"),
        currency: z.string().default("INR"),
        description: z.string().optional().describe("Payment purpose description"),
        customer: z
          .object({
            name: z.string(),
            email: z.string().email().optional(),
            contact: z.string().optional(),
          })
          .optional(),
        expire_by: z
          .number()
          .int()
          .optional()
          .describe("Unix timestamp for link expiry"),
        send_sms: z
          .boolean()
          .default(false)
          .describe("Send payment link via SMS"),
        send_email: z
          .boolean()
          .default(false)
          .describe("Send payment link via email"),
        notes: z.record(z.string()).optional(),
      },
    },
    async ({
      amount,
      currency,
      description,
      customer,
      expire_by,
      send_sms,
      send_email,
      notes,
    }) => {
      try {
        const res = await razorpay.post("/payment_links", {
          amount,
          currency,
          description,
          customer,
          expire_by,
          notify: { sms: send_sms, email: send_email },
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
    "fetch_payment_link",
    {
      title: "Fetch Payment Link",
      description: "Fetch details of a Razorpay payment link by its ID.",
      inputSchema: {
        payment_link_id: z
          .string()
          .describe("Payment Link ID (e.g. plink_xxxxxx)"),
      },
    },
    async ({ payment_link_id }) => {
      try {
        const res = await razorpay.get(`/payment_links/${payment_link_id}`);
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
    "deactivate_payment_link",
    {
      title: "Deactivate Payment Link",
      description: "Deactivate (expire) a Razorpay payment link so it can no longer be used.",
      inputSchema: {
        payment_link_id: z.string().describe("Payment Link ID to deactivate"),
      },
    },
    async ({ payment_link_id }) => {
      try {
        const res = await razorpay.patch(
          `/payment_links/${payment_link_id}`,
          { active: false }
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
