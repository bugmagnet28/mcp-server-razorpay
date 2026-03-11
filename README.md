mcp-server-razorpay
A Model Context Protocol (MCP) server that exposes Razorpay payment APIs to AI agents. Enables LLMs to create orders, manage payments, process refunds, handle subscriptions, and generate payment links autonomously.

Tools
Category	Tool	Description
Category	Tool	Description
Orders	create_order	Create a new order (amount in paise)
Orders	fetch_order	Fetch order by ID
Orders	list_orders	List orders with filters
Payments	fetch_payment	Fetch payment details
Payments	capture_payment	Capture an authorized payment
Payments	list_payments	List payments with filters
Refunds	create_refund	Full or partial refund
Refunds	fetch_refund	Fetch refund details
Refunds	list_refunds_for_payment	All refunds on a payment
Customers	create_customer	Create a customer
Customers	fetch_customer	Fetch customer by ID
Subscriptions	create_subscription	Create recurring subscription
Subscriptions	fetch_subscription	Fetch subscription status
Subscriptions	cancel_subscription	Cancel immediately or at cycle end
Payment Links	create_payment_link	Generate a shareable payment link
Payment Links	fetch_payment_link	Fetch link details
Payment Links	deactivate_payment_link	Expire a payment link
Setup
1. Get Razorpay API Keys
Sign up at dashboard.razorpay.com and get your API Key ID and Secret. Use test mode keys for development.

2. Configure Environment
bash
cp .env.example .env
# Edit .env and add your keys
3. Install & Build
bash
npm install
npm run build
4. Use with Claude Desktop
Add to your claude_desktop_config.json:

json
{
  "mcpServers": {
    "razorpay": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server-razorpay/dist/index.js"],
      "env