// pages/api/route.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message, chat_id } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message text is required" });
  }

  // Agar chat_id yuborilgan bo'lsa, undan foydalanamiz, aks holda admin chat id-si ishlatiladi.
  const targetChatId = chat_id || process.env.TELEGRAM_CHAT_ID;

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: targetChatId,
        text: message,
      },
    );
    return res
      .status(200)
      .json({ status: "Message sent", data: response.data });
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
}
