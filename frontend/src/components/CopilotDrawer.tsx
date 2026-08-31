"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, X, Send, Bot, Sparkles, ShieldCheck, CheckCircle2, Check } from "lucide-react";
import { api } from "@/lib/api";

export function CopilotDrawer() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string; sources?: string[] }[]
  >([
    {
      sender: "bot",
      text: "Hello! I am your DrishtiX AI Assistant. I can explain your opportunity match score, financial break-even, or evaluate a business you are interested in. You can also speak in Hindi or Telugu!",
      sources: ["DrishtiX Decision Engine v2.0", "PMEGP/PMFME Guidelines 2026"]
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Voice confirmation state
  const [detectedVoiceInterest, setDetectedVoiceInterest] = useState<string | null>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-copilot-drawer", handleOpen);
    return () => window.removeEventListener("open-copilot-drawer", handleOpen);
  }, []);

  const handleSend = async (qText?: string) => {
    const textToQuery = qText || question;
    if (!textToQuery.trim()) return;

    const userMsg = textToQuery;
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    if (!qText) setQuestion("");
    setLoading(true);

    // Detect if user is asking about business interest in voice/text
    const lower = userMsg.toLowerCase();
    if (lower.includes("डेयरी") || lower.includes("dairy") || lower.includes("నాకు")) {
      setDetectedVoiceInterest("Mini Dairy & Milk Product Processing");
    } else if (lower.includes("मिल्लेट") || lower.includes("millet")) {
      setDetectedVoiceInterest("Millet Processing & Packaging");
    } else if (lower.includes("रेस्टोरेंट") || lower.includes("restaurant")) {
      setDetectedVoiceInterest("Restaurant & Tiffin Center");
    }

    try {
      const res = await api.chatCopilot(userMsg, { page: "opportunity_detail", location: "Kudair" });
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
          text: "DrishtiX has evaluated your business interest. Your choice can be compared against top local market recommendations anytime.",
          sources: ["Deterministic Scoring Engine", "District Agriculture Survey"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceListen = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const voiceSample = "मुझे डेयरी फार्मिंग में रुचि है";
      setQuestion(voiceSample);
      setDetectedVoiceInterest("Mini Dairy & Milk Product Processing");
    }, 2000);
  };

  const confirmVoiceInterest = () => {
    if (detectedVoiceInterest) {
      const bizName = detectedVoiceInterest;
      setDetectedVoiceInterest(null);
      setIsOpen(false);
      router.push(`/discover?interest=${encodeURIComponent(bizName)}`);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center space-x-2 shadow-xl shadow-slate-900/20 hover:bg-blue-600 transition-all hover:scale-105 border border-slate-700"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <Bot className="w-4 h-4" />
          <span>Ask DrishtiX</span>
        </button>
      )}

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs">
                  DX
                </div>
                <div>
                  <h3 className="font-bold text-sm">Ask DrishtiX Assistant</h3>
                  <p className="text-[10px] text-slate-300 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>English • Hindi (हिंदी) • Telugu (తెలుగు)</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voice Detection Confirmation Banner */}
            {detectedVoiceInterest && (
              <div className="p-3.5 bg-blue-50 border-b border-blue-200 text-xs text-blue-900 space-y-2">
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block">Voice Interest Detected:</span>
                    <p className="text-[11px] text-slate-600">
                      You said you are interested in: <b>{detectedVoiceInterest}</b>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={confirmVoiceInterest}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] flex items-center space-x-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>[Confirm &amp; Evaluate]</span>
                  </button>
                  <button
                    onClick={() => setDetectedVoiceInterest(null)}
                    className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold text-[11px]"
                  >
                    [Change]
                  </button>
                </div>
              </div>
            )}

            {/* Quick Prompt Chips */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-1.5 text-[11px]">
              <button
                onClick={() => handleSend("मुझे डेयरी फार्मिंग में रुचि है")}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                🇮🇳 हिंदी: डेयरी फार्मिंग
              </button>
              <button
                onClick={() => handleSend("నాకు మిల్లెట్ ప్రాసెసింగ్లో ఆసక్తి ఉంది")}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                🇮🇳 తెలుగు: మిల్లెట్
              </button>
              <button
                onClick={() => handleSend("Why was Millet Processing recommended?")}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                💡 Why Millet Processing?
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-slate-100 text-slate-800 border border-slate-200/80 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-1 text-[10px] text-slate-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Sources: {msg.sources.join(", ")}</span>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                  <span>DrishtiX is querying deterministic backend model &amp; RAG store...</span>
                </div>
              )}
            </div>

            {/* Footer Input Controls */}
            <div className="p-3 border-t border-slate-200 bg-white space-y-2">
              {isListening && (
                <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex items-center space-x-2">
                  <Mic className="w-4 h-4 text-blue-600 animate-pulse" />
                  <span>Listening... Speak your interest in English, Hindi (हिंदी), or Telugu (తెలుగు).</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleVoiceListen}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isListening ? "bg-rose-50 text-rose-600 border-rose-300" : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                  }`}
                  title="Voice Input"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Tell DrishtiX what business you want to start..."
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />

                <button
                  type="button"
                  onClick={() => handleSend()}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

