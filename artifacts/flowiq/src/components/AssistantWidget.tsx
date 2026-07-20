import { useState, useRef, useEffect } from "react";
import { useChatWithAi } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCircuit, X, Send, Bot, User, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Renders AI message text with lightweight markdown:
 * - **bold** → <strong>
 * - Line breaks preserved
 * - Divider lines (─────) rendered as styled <hr>-like spans
 */
function RenderMessage({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, li) => {
        // Divider lines — render as a subtle horizontal rule
        if (/^[─━—\-]{6,}$/.test(line.trim())) {
          return <hr key={li} className="border-border/50 my-1" />;
        }
        // Split on **bold** markers
        const parts = line.split(/(\*\*[^*]*\*\*)/g);
        const content = parts.map((part, pi) =>
          /^\*\*[^*]*\*\*$/.test(part) ? (
            <strong key={pi} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={pi}>{part}</span>
          )
        );
        // Empty line → a small spacer
        if (line.trim() === "") {
          return <span key={li} className="block h-1" />;
        }
        return (
          <span key={li} className="block leading-relaxed">
            {content}
          </span>
        );
      })}
    </>
  );
}

const STARTER_PROMPTS_EN = [
  "Check my request status",
  "Help me create a request",
  "What's the approval process?",
  "Show performance recommendations",
];
const STARTER_PROMPTS_AR = [
  "تحقق من حالة طلبي",
  "ساعدني في إنشاء طلب",
  "ما هي عملية الموافقة؟",
  "أرني توصيات الأداء",
];

export default function AssistantWidget() {
  const { t, isRTL, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: "ai" | "user"; content: string }[]>([
    { role: "ai", content: t("assistant.greeting") },
  ]);
  const chatMut = useChatWithAi();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterPrompts = lang === "ar" ? STARTER_PROMPTS_AR : STARTER_PROMPTS_EN;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    chatMut.mutate(
      { data: { message: userMsg } },
      {
        onSuccess: (res) => {
          setMessages((prev) => [...prev, { role: "ai", content: res.message }]);
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            { role: "ai", content: t("assistant.errorMsg") },
          ]);
        },
      }
    );
  };

  return (
    <>
      {/* Slide-over panel */}
      {open && (
        <div
          className={`fixed bottom-0 ${isRTL ? "start-0" : "end-0"} z-[60] flex flex-col bg-background border-s border-t shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-4`}
          style={{ width: "min(380px, 100vw)", height: "min(560px, calc(100vh - 4rem))" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-primary text-primary-foreground rounded-ts-xl rounded-te-xl shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{t("assistant.title")}</p>
                <p className="text-[10px] opacity-70 leading-tight">{t("assistant.subtitle")}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${
                  msg.role === "user"
                    ? isRTL
                      ? ""
                      : "flex-row-reverse"
                    : isRTL
                    ? "flex-row-reverse"
                    : ""
                }`}
              >
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    msg.role === "ai"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <Bot className="h-3.5 w-3.5" />
                  ) : (
                    <User className="h-3.5 w-3.5" />
                  )}
                </div>
                <div
                  className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    msg.role === "ai"
                      ? "bg-muted text-foreground max-w-[96%]"
                      : "bg-primary text-primary-foreground max-w-[80%] whitespace-pre-wrap"
                  }`}
                >
                  {msg.role === "ai"
                    ? <RenderMessage text={msg.content} />
                    : msg.content}
                </div>
              </div>
            ))}
            {chatMut.isPending && (
              <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="bg-muted rounded-xl px-3 py-2">
                  <div className="flex gap-1 items-center h-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Starter prompts — show only if only 1 message (greeting) */}
          {messages.length === 1 && (
            <div className="px-3 pb-2 shrink-0">
              <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">{t("assistant.quickPrompts")}</p>
              <div className="flex flex-wrap gap-1.5">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-xs rounded-full border border-primary/30 bg-primary/5 text-primary px-2.5 py-1 hover:bg-primary/10 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2 px-3 py-3 border-t shrink-0">
            <Input
              placeholder={t("assistant.placeholder")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(message)}
              className="flex-1 text-sm h-9"
            />
            <Button
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={() => sendMessage(message)}
              disabled={!message.trim() || chatMut.isPending}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-6 end-6 z-[61] h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-xl hover:shadow-primary/40 ${
          open ? "rotate-12 scale-95" : ""
        }`}
        aria-label={t("assistant.open")}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <BrainCircuit className="h-6 w-6" />
        )}
      </button>
    </>
  );
}
