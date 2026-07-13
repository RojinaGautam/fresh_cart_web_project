"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";
import { useChatViewModel } from "./useChatViewModel";

const HIDDEN_PREFIXES = [
  "/admin",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

// View: renders the ViewModel's state, no fetch/business logic of its own.
export default function ChatWidget() {
  const pathname = usePathname();
  const {
    open,
    toggleOpen,
    messages,
    input,
    setInput,
    sending,
    error,
    handleSend,
  } = useChatViewModel();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const hidden = HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (hidden) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-[480px] w-[90vw] max-w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-[#173822] px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">FreshCart Assistant</p>
              <p className="text-[11px] text-emerald-100">
                Ask about products, deals &amp; orders
              </p>
            </div>
            <button
              type="button"
              onClick={toggleOpen}
              aria-label="Close chat"
              className="rounded-full p-1 transition hover:bg-white/10"
            >
              <FiX size={18} />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-[#f7faf4] px-4 py-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-5 ${
                    message.role === "user"
                      ? "bg-[#173822] text-white"
                      : "bg-white text-slate-800 shadow-sm ring-1 ring-slate-100"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white px-3 py-2 text-sm text-slate-400 shadow-sm ring-1 ring-slate-100">
                  Typing...
                </div>
              </div>
            )}
            {error && (
              <p className="text-center text-xs font-semibold text-red-600">{error}</p>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleSend();
            }}
            className="flex items-center gap-2 border-t border-slate-100 bg-white p-3"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about products, deals, orders..."
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#173822] text-white transition hover:bg-[#0f2d1b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiSend size={15} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={toggleOpen}
        aria-label={open ? "Close chat" : "Open chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#173822] text-white shadow-xl transition hover:bg-[#0f2d1b] active:scale-95"
      >
        {open ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </button>
    </div>
  );
}
