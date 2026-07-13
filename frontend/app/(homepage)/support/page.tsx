"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  FiArrowRight,
  FiCreditCard,
  FiHelpCircle,
  FiMail,
  FiMessageCircle,
  FiPackage,
  FiPhone,
  FiRefreshCcw,
  FiSearch,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { createSupportTicketAction } from "@/lib/actions/support-action";

const supportCards = [
  { title: "Account Help", text: "Login, signup, profile, and password guidance.", icon: FiUser },
  { title: "Orders", text: "Check order states and recent grocery activity.", icon: FiPackage },
  { title: "Payments", text: "Payment method and checkout help.", icon: FiCreditCard },
  { title: "Delivery", text: "Delivery timing and address support.", icon: FiTruck },
  { title: "Refunds", text: "Return and refund questions.", icon: FiRefreshCcw },
  { title: "Contact Support", text: "Reach the FreshCart support team.", icon: FiMessageCircle },
];

const faqs = [
  "How do I update my profile details?",
  "Can I change my delivery address?",
  "Where can I see saved products?",
  "How do I reset my password?",
];

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setFeedback({ type: "error", text: "Please fill in every field before sending." });
      return;
    }

    setSubmitting(true);

    const response = await createSupportTicketAction({ name, email, subject, message });

    setSubmitting(false);

    if (!response.success) {
      setFeedback({ type: "error", text: response.message || "Unable to send your message." });
      return;
    }

    setFeedback({ type: "success", text: "Thanks! Our support team will get back to you soon." });
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="space-y-9">
      <section className="overflow-hidden rounded-md bg-[#d9e4d7]">
        <div className="relative min-h-[320px] px-7 py-9 sm:px-10">
          <Image
            src="/images/deals/grocery-aisle-hero.png"
            alt="FreshCart grocery support"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/55 to-transparent" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#079b3b] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
              <FiHelpCircle size={13} />
              FreshCart Support
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-tight text-[#15251b] sm:text-4xl">
              How Can We{" "}
              <span className="text-green-600">Help You?</span>
            </h1>
            <p className="mt-3 max-w-md text-sm font-normal leading-6 text-gray-600">
              Find support for your account, orders, delivery, payment, and
              FreshCart profile in one calm place.
            </p>
            <div className="mt-6 flex max-w-xl items-center rounded-full bg-white px-4 py-3 text-gray-500 shadow-sm ring-1 ring-[#d8e2d4]">
              <FiSearch size={18} />
              <input
                placeholder="Search account, order, delivery..."
                className="ml-3 w-full bg-transparent text-sm font-medium outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#15251b]">
              Support Topics
            </h2>
            <p className="mt-1 text-[11px] font-normal text-gray-500">
              Choose the area where you need FreshCart help.
            </p>
          </div>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#dfeadb] px-4 py-2 text-xs font-bold text-green-800 transition hover:bg-[#d3e2cf]"
          >
            Contact us
            <FiArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {supportCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="rounded-2xl border border-[#d8e2d4] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <Icon size={21} />
                </span>
                <h3 className="mt-4 text-base font-semibold text-[#15251b]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {card.text}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-[#d8e2d4] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#15251b]">Quick FAQ</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq}
                className="group rounded-xl border border-[#d8e2d4] bg-[#f7faf4] p-4"
              >
                <summary className="cursor-pointer text-sm font-semibold text-[#15251b]">
                  {faq}
                </summary>
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  You can manage this from your dashboard or profile settings.
                  If the option is not available yet, contact support and we
                  will help you.
                </p>
              </details>
            ))}
          </div>
        </div>

        <div
          id="contact"
          className="scroll-mt-24 rounded-2xl border border-[#d8e2d4] bg-white p-6 shadow-sm"
        >
          <h2 className="text-2xl font-semibold text-[#15251b]">
            Contact Support
          </h2>

          {feedback && (
            <p
              className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${
                feedback.type === "success"
                  ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                  : "border-red-100 bg-red-50 text-red-700"
              }`}
            >
              {feedback.text}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="rounded-xl border border-[#d8e2d4] bg-[#f7faf4] px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                className="rounded-xl border border-[#d8e2d4] bg-[#f7faf4] px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Subject"
              className="rounded-xl border border-[#d8e2d4] bg-[#f7faf4] px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write your message"
              rows={5}
              className="resize-none rounded-xl border border-[#d8e2d4] bg-[#f7faf4] px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#173822] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2d1b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { icon: FiMail, title: "Email", value: "support@freshcart.local", href: "mailto:support@freshcart.local" },
          { icon: FiPhone, title: "Phone", value: "+1 (555) 432-1987", href: "tel:+15554321987" },
          { icon: FiMessageCircle, title: "Hours", value: "Sun-Fri, 8 AM - 8 PM", href: "#contact" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl border border-[#d8e2d4] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <Icon className="text-emerald-700" size={22} />
              <p className="mt-3 text-sm font-semibold text-[#15251b]">
                {item.title}
              </p>
              <p className="mt-1 text-sm text-gray-500">{item.value}</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
