import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!KEY_ID || !KEY_SECRET) {
  throw new Error(
    "Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET environment variables."
  );
}

export const razorpay = axios.create({
  baseURL: "https://api.razorpay.com/v1",
  auth: {
    username: KEY_ID,
    password: KEY_SECRET,
  },
  headers: {
    "Content-Type": "application/json",
  },
});