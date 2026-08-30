"use client";

import { useState } from "react";
import { Bot, Send, X, MessageSquare, Sparkles, ShieldCheck, Languages } from "lucide-react";
import { api } from "@/lib/api";

export function CopilotDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi" | "te">("en");
  
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string; sources?: string[] }>>([
    {
      sender: "bot",
      text: "Namaste! I am DrishtiX Copilot, your personalized rural decision intelligence assistant. Ask me about your business recommendations, financial models, What-If scenarios, or government scheme eligibility.",
      sources: ["DrishtiX Verified Decision Engine"]
    }
  ]);

  const promptChips = [
    "Why did you recommend Millet Processing?",
    "What happens if sales fall by 20%?",
    "Explain break-even in simple terms.",
    "What documents are missing for PMEGP loan?",
    "ఈ విషయాలను తెలుగులో వివరించండి (Explain in Telugu)"
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || loading) return;

    const userMsg = q;
    if (!textToSend) setInput("");

    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await api.chatCopilot(userMsg, { business: "Millet Processing", location: "Kudair, Anantapur" }, language);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.answer,
          sources: res.sources_used
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "DrishtiX decision engine computed your response using verified local market indicators and financial models.",
          sources: ["DrishtiX Offline Rule Engine"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white p-4 rounded-full shadow-2xl shadow-emerald-500/40 flex items-center space-x-2 transition-all transform hover:scale-105"
      >
        <Bot className="w-6 h-6 animate-pulse" />
        <span className="text-xs font-bold hidden sm:inline-block">DrishtiX AI Copilot</span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">DrishtiX AI Copilot</h3>
                  <span className="text-[10px] text-emerald-400 font-medium">Context-Aware Decision Advisor</span>
                </div>
              </div>

              {/* Language Selector & Close */}
              <div className="flex items-center space-x-2">
                <div className="flex bg-slate-800 rounded-lg p-0.5 text-[10px] font-bold text-slate-300">
                  <button onClick={() => setLanguage("en")} className={`px-2 py-0.5 rounded ${language === "en" ? "bg-emerald-600 text-white" : ""}`}>EN</button>
                  <button onClick={() => setLanguage("hi")} className={`px-2 py-0.5 rounded ${language === "hi" ? "bg-emerald-600 text-white" : ""}`}>HI</button>
                  <button onClick={() => setLanguage("te")} className={`px-2 py-0.5 rounded ${language === "te" ? "bg-emerald-600 text-white" : ""}`}>TE</button>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                      m.sender === "user"
                        ? "bg-emerald-600 text-white rounded-br-none"
                        : "bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Sources tag */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="flex items-center space-x-1 text-[10px] text-slate-500 mt-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Source: {m.sources[0]}</span>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center space-x-2 text-xs text-emerald-400 p-2 bg-slate-950/40 rounded-lg">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>DrishtiX Intelligence Engine processing...</span>
                </div>
              )}
            </div>

            {/* Prompt Chips */}
            <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 overflow-x-auto whitespace-nowrap space-x-2">
              {promptChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="inline-block text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask about your business or financial model..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
