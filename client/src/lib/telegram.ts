export const sendTelegramMessage = async (
  message: string,
  chat_id?: string,
) => {
  try {
    const response = await fetch("/api/telegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        chat_id,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to send message");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending telegram message:", error);
    throw error;
  }
};
