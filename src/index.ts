#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerOrderTools } from "./tools/orders.js";
import { registerPaymentTools } from "./tools/payments.js";
import { registerRefundTools } from "./tools/refunds.js";
import { registerCustomerTools } from "./tools/customers.js";
import { registerSubscriptionTools } from "./tools/subscriptions.js";
import { registerPaymentLinkTools } from "./tools/paymentLinks.js";

const server = new McpServer({
  name: "mcp-server-razorpay",
  version: "1.0.0",
});

registerOrderTools(server);
registerPaymentTools(server);
registerRefundTools(server);
registerCustomerTools(server);
registerSubscriptionTools(server);
registerPaymentLinkTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Razorpay MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});