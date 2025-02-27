import { type NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { z } from "zod";

// Define the request body schema
const messageSchema = z.object({
  message: z.string().min(1, "Message text is required"),
  chat_id: z.string().optional(),
});

type MessageRequest = z.infer<typeof messageSchema>;

// Define the Telegram API response type
interface TelegramResponse {
  ok: boolean;
  result: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username: string;
    };
    chat: {
      id: number;
      first_name?: string;
      username?: string;
      type: string;
    };
    date: number;
    text: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body: MessageRequest = await request.json();
    const validationResult = messageSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const { message, chat_id } = validationResult.data;
    const targetChatId = chat_id || process.env.TELEGRAM_CHAT_ID;

    if (!process.env.TELEGRAM_BOT_TOKEN) {
      return NextResponse.json(
        { error: "Telegram bot token is not configured" },
        { status: 500 },
      );
    }

    // Send message to Telegram
    const response = await axios.post<TelegramResponse>(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: targetChatId,
        text: message,
        parse_mode: "HTML", // Support HTML formatting
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return NextResponse.json({
      status: "success",
      data: response.data,
    });
  } catch (error) {
    console.error("Error sending Telegram message:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: "Failed to send message",
          details: error.response?.data || error.message,
        },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Rate limiting and allowed methods
export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;
