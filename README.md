<div align="center">

# mcp-server-razorpay

**A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that exposes [Razorpay](https://razorpay.com) APIs to AI agents.**

Enable AI assistants to create orders, process payments, handle refunds, manage subscriptions, and generate payment links — autonomously.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MCP SDK](https://img.shields.io/badge/MCP%20SDK-1.10.2-green)](https://github.com/modelcontextprotocol/typescript-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Razorpay](https://img.shields.io/badge/Razorpay-API%20v1-072654?logo=razorpay)](https://razorpay.com/docs/api/)

</div>

---

## 🤖 What Can an AI Agent Do With This?

Once connected, your AI assistant can handle real payment operations via natural language:

- *"Create an order for ₹999 and send a payment link to john@example.com"*
- *"Refund payment pay_abc123 with optimum speed"*
- *"List all payments from the last 7 days"*
- *"Cancel subscription sub_xyz at the end of the current billing cycle"*
- *"Create a customer for Riya Sharma with contact +919876543210"*

---

## 🛠️ Tools

### 📦 Orders
| Tool | Description |
|---|---|
| `create_order` | Create a new order (amount in paise, e.g. 50000 = ₹500) |
| `fetch_order` | Fetch order details by order ID |
| `list_orders` | List orders with filters (count, date range, status) |

### 💳 Payments
| Tool | Description |
|---|---|
| `fetch_payment` | Fetch payment details by payment ID |
| `capture_payment` | Capture an authorized payment |
| `list_payments` | List payments with date and count filters |

### 🔄 Refunds
| Tool | Description |
|---|---|
| `create_refund` | Full or partial refund with normal/optimum speed |
| `fetch_refund` | Fetch a specific refund by refund ID |
| `list_refunds_for_payment` | List all refunds on a payment |

### 👤 Customers
| Tool | Description |
|---|---|
| `create_customer` | Create a new Razorpay customer |
| `fetch_customer` | Fetch customer details by customer ID |

### 🔁 Subscriptions
| Tool | Description |
|---|---|
| `create_subscription` | Create a recurring subscription for a plan |
| `fetch_subscription` | Fetch subscription status and details |
| `cancel_subscription` | Cancel immediately or at end of billing cycle |

### 🔗 Payment Links
| Tool | Description |
|---|---|
| `create_payment_link` | Generate a shareable payment link with optional SMS/email delivery |
| `fetch_payment_link` | Fetch payment link details and status |
| `deactivate_payment_link` | Expire a payment link immediately |

---

## ⚡ Quickstart

### 1. Get Razorpay API Keys

Sign up at [dashboard.razorpay.com](https://dashboard.razorpay.com/app/keys) → Settings → API Keys.
Use **Test Mode** keys during development.

### 2. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/mcp-server-razorpay.git
cd mcp-server-razorpay
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Build

```bash
npm run build
```

---

## 🔌 Connect to Claude Desktop

Edit your `claude_desktop_config.json`:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "razorpay": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server-razorpay/dist/index.js"],
      "env": {
        "RAZORPAY_KEY_ID": "rzp_test_xxxxxxxxxxxxxx",
        "RAZORPAY_KEY_SECRET": "xxxxxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

Restart Claude Desktop — you'll see the 🔨 tools icon appear.

---

## 🔌 Connect to Cursor

Go to `Settings → Tools & Integrations → New MCP Server` and add:

```json
{
  "razorpay": {
    "command": "node",
    "args": ["/absolute/path/to/mcp-server-razorpay/dist/index.js"],
    "env": {
      "RAZORPAY_KEY_ID": "rzp_test_xxxxxxxxxxxxxx",
      "RAZORPAY_KEY_SECRET": "xxxxxxxxxxxxxxxxxxxxxxxx"
    }
  }
}
```

---

## 🧪 Debug with MCP Inspector

```bash
npm run inspector
```

Opens a browser UI where you can test every tool interactively before connecting to a client.

---

## 📁 Project Structure

```
mcp-server-razorpay/
├── src/
│   ├── index.ts              # Entry point & server init
│   ├── client.ts             # Razorpay axios instance + Basic Auth
│   └── tools/
│       ├── orders.ts         # Order management tools
│       ├── payments.ts       # Payment tools
│       ├── refunds.ts        # Refund tools
│       ├── customers.ts      # Customer tools
│       ├── subscriptions.ts  # Subscription tools
│       └── paymentLinks.ts   # Payment link tools
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🔒 Security Notes

- Never commit your `.env` file — it's in `.gitignore`
- Use **Test Mode** keys during development; switch to Live keys only in production
- The server runs locally — your API keys never leave your machine

---

## 🤝 Contributing

PRs welcome! If you'd like to add tools (e.g. Payouts, Settlements, Webhooks), open an issue first to discuss.

---

## 📄 License

MIT — free for personal and commercial use.
