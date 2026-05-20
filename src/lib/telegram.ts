// Lead notification to Telegram. Fail-open: never blocks the response.

export interface LeadPayload {
  source: string;
  name?: string;
  phone?: string;
  email?: string;
  topic?: string;
  message?: string;
  city?: string;
  ip?: string;
  ua?: string;
  locale?: string;
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function escapeMd(s: string): string {
  // Telegram MarkdownV2 reserved chars
  return s.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

function fmt(payload: LeadPayload): string {
  const lines: string[] = [];
  lines.push("🔔 *Новый лид — allergoscreen.kz*");
  lines.push("");
  lines.push(`*Источник:* ${escapeMd(payload.source || "contact")}`);
  if (payload.locale) lines.push(`*Язык:* ${escapeMd(payload.locale)}`);
  if (payload.name) lines.push(`*Имя:* ${escapeMd(payload.name)}`);
  if (payload.phone) lines.push(`*Телефон:* ${escapeMd(payload.phone)}`);
  if (payload.email) lines.push(`*Email:* ${escapeMd(payload.email)}`);
  if (payload.city) lines.push(`*Город:* ${escapeMd(payload.city)}`);
  if (payload.topic) lines.push(`*Тема:* ${escapeMd(payload.topic)}`);
  if (payload.message) {
    lines.push("");
    lines.push(`*Сообщение:*\n${escapeMd(payload.message)}`);
  }
  return lines.join("\n");
}

export async function sendLeadToTelegram(payload: LeadPayload): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("[telegram] missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID — skipping");
    return;
  }
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const body = {
    chat_id: TELEGRAM_CHAT_ID,
    text: fmt(payload),
    parse_mode: "MarkdownV2",
    disable_web_page_preview: true,
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[telegram] sendMessage failed:", res.status, text);
  }
}
