"use client";

import { useState } from "react";
import { ChatTurn } from "../../../lib/api/chat";
import { sendChatMessageAction } from "../../../lib/actions/chat-action";

export type ChatMessage = ChatTurn & { id: string };

const WELCOME_MESSAGE =
  "Hi! I'm the FreshCart Assistant. Ask me about products, categories, deals, or your orders.";

// ViewModel: owns the chat widget's conversation state/logic for the View.
export function useChatViewModel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "model", text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const toggleOpen = () => setOpen((value) => !value);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setError("");

    const history: ChatTurn[] = messages
      .filter((message) => message.id !== "welcome")
      .map((message) => ({ role: message.role, text: message.text }));

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setSending(true);

    const response = await sendChatMessageAction(trimmed, history);

    setSending(false);

    if (!response.success) {
      setError(response.message || "Something went wrong. Please try again.");
      return;
    }

    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-model`, role: "model", text: response.data.reply },
    ]);
  };

  return {
    open,
    toggleOpen,
    messages,
    input,
    setInput,
    sending,
    error,
    handleSend,
  };
}
