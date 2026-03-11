import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { razorpay } from "../client.js";

export function registerCustomerTools(server: McpServer) {
  server.registerTool(
    "create_customer",
    {
      title: "Create Customer",
      description: "Create a new customer in Razorpay.",
      inputSchema: {
        name: z.string().describe("Customer full name"),
        email: z.string().email().optional().describe("Customer email address"),
        contact: z
          .string()
          .optional()
          .describe("Customer phone number with country code e.g. +919876543210"),
        fail_existing: z
          .enum(["0", "1"])
          .default("1")
          .describe("0 = return existing customer if duplicate, 1 = throw error"),
        notes: z.record(z.string()).optional(),
      },
    },
    async ({ name, email, contact, fail_existing, notes }) => {
      try {
        const res = await razorpay.post("/customers", {
          name,
          email,
          contact,
          fail_existing,
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
    "fetch_customer",
    {
      title: "Fetch Customer",
      description: "Fetch a Razorpay customer by their customer ID.",
      inputSchema: {
        customer_id: z
          .string()
          .describe("Razorpay Customer ID (e.g. cust_xxxxxx)"),
      },
    },
    async ({ customer_id }) => {
      try {
        const res = await razorpay.get(`/customers/${customer_id}`);
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
