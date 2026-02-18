'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DEMO_CASES } from '@/lib/mock-data';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  actions?: { label: string; action: () => void }[];
  timestamp: Date;
}

const SUGGESTIONS = [
  { text: '📂 Mostra casi critici', cmd: '/casi-critici' },
  { text: '📊 Report analytics', cmd: '/analytics' },
  { text: '🔍 Cerca prove', cmd: '/cerca' },
  { text: '🧠 Analizza pattern criminali', cmd: 'Analizza i pattern criminali attivi e suggerisci correlazioni' },
  { text: '⚠️ Valutazione minacce', cmd: 'Genera una valutazione delle minacce attuali basata sui casi attivi' },
  { text: '🕵️ Profilo criminale', cmd: 'Crea un profilo criminale basato sui casi di rapina attivi' },
  { text: '📋 Ultimi audit log', cmd: '/audit' },
  { text: '💡 Cosa puoi fare?', cmd: '/aiuto' },
];

export function CrimeMind() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: 'Ciao! Sono **CrimeMind**, il tuo assistente AI investigativo powered by **GPT-5.2**.\n\nPosso analizzare casi, correlare prove, generare profili criminali, valutare minacce e molto altro.\n\nScrivimi qualsiasi cosa in linguaggio naturale! 🧠',
      timestamp: new Date(),
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [aiMode, setAiMode] = useState<'gpt52' | 'offline'>('gpt52');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) {
      setPulse(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const addMsg = useCallback((role: 'user' | 'ai', text: string, actions?: Message['actions']) => {
    setMessages(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, role, text, actions, timestamp: new Date() }]);
  }, []);

  const callGPT4o = useCallback(async (userText: string, allMessages: Message[]) => {
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages.filter(m => m.id !== 'welcome').map(m => ({ role: m.role, text: m.text })),
          context: { page: pathname },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAiMode('gpt52');
      return data.reply as string;
    } catch (err) {
      console.error('GPT-4o error, falling back:', err);
      setAiMode('offline');
      return null;
    }
  }, [pathname]);

  const processCommand = useCallback(async (raw: string) => {
    const q = raw.trim().toLowerCase();
    const userText = raw.trim();
    addMsg('user', userText);
    setInput('');

    // ---- Quick local commands (instant, no API call) ----

    // Navigation
    const navRoutes: Record<string, string> = {
      '/home': '/', 'command center': '/', 'dashboard': '/', 'homepage': '/',
      '/crea-caso': '/cases', 'nuovo caso': '/cases', 'crea caso': '/cases',
      '/cerca': '/search', 'neurosearch': '/search',
      '/analytics': '/analytics', '/audit': '/audit', '/utenti': '/users',
    };
    for (const [key, route] of Object.entries(navRoutes)) {
      if (q === key || q.includes(key)) {
        addMsg('ai', `🧭 Ti porto a **${route}**!`);
        router.push(route);
        return;
      }
    }

    // Quick data lookups
    if (q === '/casi-critici' || q === 'casi critici') {
      const critical = DEMO_CASES.filter(c => c.priority === 'CRITICAL' || c.priority === 'HIGH');
      const list = critical.slice(0, 5).map(c => `• **${c.caseNumber}** — ${c.title} _(${c.priority}, ${c.status})_`).join('\n');
      addMsg('ai', `🚨 **${critical.length} casi ad alta priorità:**\n\n${list}`,
        critical.slice(0, 3).map(c => ({ label: `Apri ${c.caseNumber}`, action: () => router.push(`/cases/${c.id}`) }))
      );
      return;
    }

    if (q === '/aiuto' || q === 'aiuto' || q === 'help') {
      addMsg('ai', '💡 **CrimeMind AI — Powered by GPT-5.2**\n\nPuoi chiedermi qualsiasi cosa in linguaggio naturale:\n\n• 🔍 **"Analizza il caso rapina Milano"** — analisi investigativa AI\n• 🧠 **"Quali pattern vedi tra i casi attivi?"** — correlazioni\n• 🕵️ **"Crea un profilo criminale"** — profilazione AI\n• ⚠️ **"Valutazione minacce"** — threat assessment\n• 📊 **"Statistiche piattaforma"** — dati real-time\n• 🗺️ **"Casi per zona geografica"** — distribuzione\n• 🧭 **"Vai a [pagina]"** — navigazione\n\nScrivi liberamente, capisco il contesto! 🇮🇹');
      return;
    }

    // ---- Everything else goes to GPT-4o ----
    setTyping(true);
    const currentMessages = [...messages, { id: 'temp', role: 'user' as const, text: userText, timestamp: new Date() }];
    const reply = await callGPT4o(userText, currentMessages);
    setTyping(false);

    if (reply) {
      addMsg('ai', reply);
    } else {
      // Offline fallback
      addMsg('ai', '⚠️ AI temporaneamente non disponibile. Riprova tra poco o usa i suggerimenti rapidi per comandi locali.');
    }
  }, [addMsg, callGPT4o, messages, router]);

  const handleSend = useCallback(() => {
    if (!input.trim() || typing) return;
    processCommand(input);
  }, [input, typing, processCommand]);

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.+?)_/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-20 md:bottom-5 right-4 md:right-5 z-[60] w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center transition-all duration-300 ${
          open ? 'bg-ci-card border-2 border-purple-500 rotate-0 scale-95' : 'bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 scale-100'
        } ${pulse && !open ? 'animate-bounce' : ''}`}
        aria-label="CrimeMind AI"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-purple-400">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-2xl">🧠</span>
        )}
      </button>

      {/* Notification dot */}
      {!open && pulse && (
        <span className="fixed bottom-[5.25rem] md:bottom-14 right-4 md:right-5 z-[61] w-3 h-3 bg-green-500 rounded-full border-2 border-ci-bg animate-pulse" />
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-[5.5rem] md:bottom-24 right-2 md:right-5 z-[60] w-[360px] max-w-[calc(100vw-16px)] md:max-w-[calc(100vw-40px)] h-[420px] md:h-[520px] max-h-[calc(100vh-120px)] bg-ci-card border border-ci-border rounded-2xl shadow-2xl shadow-purple-500/10 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 border-b border-ci-border px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-lg shadow">
              🧠
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-ci-text">CrimeMind AI</p>
                <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${aiMode === 'gpt52' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {aiMode === 'gpt52' ? 'GPT-5.2' : 'OFFLINE'}
                </span>
              </div>
              <p className="text-[10px] text-purple-400">Assistente Investigativo AI • {aiMode === 'gpt52' ? 'Live' : 'Locale'}</p>
            </div>
            <span className={`w-2 h-2 rounded-full animate-pulse ${aiMode === 'gpt52' ? 'bg-green-500' : 'bg-yellow-500'}`} />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-md'
                    : 'bg-ci-bg border border-ci-border text-ci-text rounded-bl-md'
                }`}>
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-ci-border/50">
                      {msg.actions.map((a, i) => (
                        <button
                          key={i}
                          onClick={a.action}
                          className="text-xs px-2.5 py-1 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-full transition font-medium"
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className={`text-[9px] mt-1 ${msg.role === 'user' ? 'text-purple-200' : 'text-ci-muted'}`}>
                    {msg.timestamp.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-ci-bg border border-ci-border rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div className="px-3 py-2 border-t border-ci-border/50 flex-shrink-0">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {SUGGESTIONS.map(s => (
                <button
                  key={s.cmd}
                  onClick={() => processCommand(s.cmd)}
                  className="text-[11px] px-2.5 py-1.5 bg-ci-bg border border-ci-border rounded-full text-ci-muted hover:text-purple-400 hover:border-purple-500/40 transition whitespace-nowrap flex-shrink-0"
                >
                  {s.text}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-ci-border flex-shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Scrivi un comando o chiedi qualcosa..."
                className="flex-1 px-3 py-2.5 bg-ci-bg border border-ci-border rounded-xl focus:border-purple-500 focus:outline-none text-ci-text text-sm placeholder:text-ci-muted/60"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || typing}
                className="px-3 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition disabled:opacity-40 disabled:hover:bg-purple-600 flex-shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
