"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Send,
  AlertCircle,
  Stethoscope,
  User,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { AiChatMessage } from "@/lib/types";

export default function AssistantPage() {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: "msg-1",
      sender: "assistant",
      content:
        "Hello Sarah. I'm your MedVault Clinical AI Assistant. I have indexed your current profile (Allergies: Penicillin, Peanuts; Conditions: Mild Hypertension; Medications: Lisinopril 10mg) and your latest lab report from Metro Central Diagnostic. How can I help you understand your health data today?",
      timestamp: "Just now",
      suggestedActions: [
        "Explain my cholesterol panel in simple terms",
        "Can I take Ibuprofen with my Lisinopril?",
        "What foods help lower LDL cholesterol naturally?",
        "What should I ask Dr. Vance at my next visit?",
      ],
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const cannedAnswers: Record<string, string> = {
    cholesterol:
      "Based on your report from Sept 18, 2026: Your Total Cholesterol is 215 mg/dL (target is <200) and your LDL is 132 mg/dL (target is <100). This is considered borderline elevated. On the positive side, your HDL ('good cholesterol') is robust at 58 mg/dL, and your triglycerides and glucose (92 mg/dL) are optimal. Doctors usually suggest reducing saturated animal fats and increasing soluble fiber before considering medication.",
    ibuprofen:
      "⚠️ Drug Interaction Alert: Taking NSAIDs like Ibuprofen with Lisinopril (an ACE inhibitor) requires caution. NSAIDs can diminish the blood pressure-lowering effect of Lisinopril and increase stress on your kidneys. For mild aches or fever, Acetaminophen (Tylenol) is generally preferred for patients on Lisinopril unless your physician specifies otherwise.",
    foods:
      "Here are evidence-based nutritional strategies to help lower LDL:\n1. Soluble Fiber: Oats, barley, beans, and lentils bind to cholesterol in your digestive tract.\n2. Healthy Monounsaturated Fats: Olive oil, avocados, and walnuts.\n3. Plant Sterols & Stanols: Fortified foods or natural nuts that block cholesterol absorption.\n4. Fatty Fish: Rich in Omega-3 fatty acids to help cardiovascular resilience.",
    questions:
      "Top 3 questions tailored for Dr. Vance (Cardiology):\n1. 'My BP has been averaging 118/76 mmHg. Is my Lisinopril 10mg dose still optimal?'\n2. 'Given my LDL of 132 mg/dL, do you recommend a calcium score test or dietary intervention first?'\n3. 'Are there any specific exercises or heart-rate targets I should focus on?'",
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim()) return;

    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt("");
    setIsTyping(true);

    setTimeout(() => {
      let replyContent =
        "Thank you for asking. Based on your records, your health indicators are stable with mild elevation in LDL cholesterol (132 mg/dL). Always confirm specific clinical decisions or medication modifications with your primary care physician.";

      const lower = text.toLowerCase();
      if (lower.includes("cholesterol") || lower.includes("lipid") || lower.includes("ldl")) {
        replyContent = cannedAnswers.cholesterol;
      } else if (lower.includes("ibuprofen") || lower.includes("pain") || lower.includes("nsaid")) {
        replyContent = cannedAnswers.ibuprofen;
      } else if (lower.includes("food") || lower.includes("diet") || lower.includes("eat")) {
        replyContent = cannedAnswers.foods;
      } else if (lower.includes("ask") || lower.includes("doctor") || lower.includes("question") || lower.includes("vance")) {
        replyContent = cannedAnswers.questions;
      }

      const botMsg: AiChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        content: replyContent,
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Stethoscope className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              MedVault AI Assistant
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Clinical Demo Assistant
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personal health assistant trained on clinical literature and your vaulted health records.
          </p>
        </div>

        <button
          onClick={() => {
            setMessages([messages[0]]);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Chat</span>
        </button>
      </div>

      {/* Model Transparency Disclaimer */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Demonstration Engine:</strong> Responses are generated locally using simulated clinical logic. To connect live Gemini 1.5 Pro or OpenAI GPT-4o models, add your keys in{" "}
          <Link href="/admin" className="underline font-semibold hover:text-amber-950">
            Admin Configuration
          </Link>
          . Never alter prescription medications without consulting a licensed physician.
        </p>
      </div>

      {/* Chat Window */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col h-[560px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === "user"
                    ? "bg-[#0a192f] text-white"
                    : "bg-teal-600 text-white"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                  msg.sender === "user"
                    ? "bg-teal-600 text-white rounded-tr-xs"
                    : "bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs"
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>

                {/* Suggested prompt chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                      Suggested Inquiries:
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(action)}
                          className="text-left text-[11px] font-medium text-teal-700 hover:text-teal-900 bg-white hover:bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200/80 transition-colors flex items-center justify-between"
                        >
                          <span>{action}</span>
                          <ArrowRight className="w-3 h-3 text-teal-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`text-[9px] pt-1 ${
                    msg.sender === "user" ? "text-teal-100 text-right" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] ml-1">Analyzing records...</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about your lab results, drug interactions, or dietary questions..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white text-xs"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isTyping}
              className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 transition-colors shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
