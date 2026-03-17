export async function sendTelegramNotification(
  message: string
): Promise<void> {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
        }),
      }
    );

    if (!response.ok) {
      const body = await response.text();
      console.error(
        `[telegram] Failed to send notification: ${response.status} ${body}`
      );
    }
  } catch (error) {
    console.error("[telegram] Failed to send notification:", error);
  }
}
