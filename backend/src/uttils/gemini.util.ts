import { GEMINI_API_KEY } from "../configs/constant";
import { HttpException } from "../exceptions/http-exception";

// gemini-2.5-flash itself returns 404 for generateContent on newer API keys
// ("no longer available to new users" per Google's own error message) — the
// free-tier model still on the 2.5 generation is gemini-2.5-flash-lite.
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent";

const RETRYABLE_STATUS_CODES = [429, 503];
const MAX_RETRIES = 2;

export type GeminiHistoryTurn = {
  role: "user" | "model";
  text: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const callGemini = async (body: unknown) => {
  const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return response;
};

export const generateChatReply = async (
  systemInstruction: string,
  history: GeminiHistoryTurn[],
  message: string,
): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new HttpException(500, "Chat assistant is not configured");
  }

  const contents = [
    ...history.map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.text }],
    })),
    {
      role: "user",
      parts: [{ text: message }],
    },
  ];

  const requestBody = {
    systemInstruction: {
      parts: [{ text: systemInstruction }],
    },
    contents,
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 512,
    },
  };

  let response: Response | undefined;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    response = await callGemini(requestBody);

    if (response.ok || !RETRYABLE_STATUS_CODES.includes(response.status)) {
      break;
    }

    if (attempt < MAX_RETRIES) {
      await sleep(500 * 2 ** attempt);
    }
  }

  if (!response || !response.ok) {
    const errorBody = response ? await response.text() : "no response";
    console.error("Gemini API error:", response?.status, errorBody);

    const status = response?.status === 429 ? 429 : 502;
    throw new HttpException(
      status,
      status === 429
        ? "Chat assistant is getting a lot of requests right now. Please try again in a moment."
        : "Chat assistant is temporarily unavailable. Please try again shortly.",
    );
  }

  const data = await response.json();
  const reply = data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text || "")
    .join("")
    .trim();

  if (!reply) {
    throw new HttpException(502, "Chat assistant did not return a response");
  }

  return reply;
};
