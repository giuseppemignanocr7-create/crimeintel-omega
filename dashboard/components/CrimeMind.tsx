'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DEMO_CASES, DEMO_ANALYTICS, DEMO_AUDIT_LOG, DEMO_USERS } from '@/lib/mock-data';
import api from '@/lib/api';

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
  { text: '➕ Crea nuovo caso', cmd: '/crea-caso' },
  { text: '🔍 Cerca prove', cmd: '/cerca' },
  { text: '👥 Lista utenti attivi', cmd: '/utenti' },
  { text: '📋 Ultimi audit log', cmd: '/audit' },
  { text: '🧠 Status AI engine', cmd: '/ai-status' },
  { text: '🗺️ Casi per città', cmd: '/mappa' },
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
      text: 'Ciao! Sono **CrimeMind**, il tuo assistente AI. Posso aiutarti a navigare, cercare casi, creare nuovi record, analizzare dati e molto altro.\n\nProva a scrivermi qualcosa o usa i suggerimenti rapidi qui sotto.',
      timestamp: new Date(),
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [pulse, setPulse] = useState(true);
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

  const addMsg = (role: 'user' | 'ai', text: string, actions?: Message['actions']) => {
    setMessages(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, role, text, actions, timestamp: new Date() }]);
  };

  const simulateTyping = (callback: () => void) => {
    setTyping(true);
    const delay = 400 + Math.random() * 800;
    setTimeout(() => { setTyping(false); callback(); }, delay);
  };

  const processCommand = (raw: string) => {
    const q = raw.trim().toLowerCase();
    addMsg('user', raw.trim());
    setInput('');

    // Navigation commands
    if (q.includes('/home') || q.includes('command center') || q.includes('dashboard') || q.includes('homepage')) {
      simulateTyping(() => {
        addMsg('ai', '🏠 Ti porto alla **Command Center**!', [{ label: 'Vai →', action: () => router.push('/') }]);
        router.push('/');
      });
      return;
    }

    if (q === '/casi-critici' || q.includes('casi critici') || q.includes('casi urgenti') || q.includes('critical')) {
      const critical = DEMO_CASES.filter(c => c.priority === 'CRITICAL' || c.priority === 'HIGH');
      simulateTyping(() => {
        const list = critical.slice(0, 5).map(c => `• **${c.caseNumber}** — ${c.title} _(${c.priority}, ${c.status})_`).join('\n');
        addMsg('ai', `🚨 Ho trovato **${critical.length} casi ad alta priorità**:\n\n${list}`, 
          critical.slice(0, 3).map(c => ({ label: `Apri ${c.caseNumber}`, action: () => router.push(`/cases/${c.id}`) }))
        );
      });
      return;
    }

    if (q === '/analytics' || q.includes('report analytics') || q.includes('statistiche') || q.includes('analytics')) {
      const a = DEMO_ANALYTICS;
      simulateTyping(() => {
        addMsg('ai', `📊 **Report Analytics Rapido:**\n\n• Casi totali: **${a.casesByStatus.reduce((s: number, x: { count: number }) => s + x.count, 0)}**\n• Prove totali: **${a.evidencePerType.reduce((s: number, x: { count: number }) => s + x.count, 0)}**\n• AI completate: **${a.aiProcessing.completed}**\n• AI in elaborazione: **${a.aiProcessing.processing}**\n• Errori AI: **${a.aiProcessing.failed}**`,
          [{ label: 'Vai ad Analytics', action: () => router.push('/analytics') }]
        );
      });
      return;
    }

    if (q === '/crea-caso' || q.includes('crea caso') || q.includes('nuovo caso') || q.includes('crea un caso') || q.includes('new case')) {
      simulateTyping(() => {
        addMsg('ai', '➕ Ti porto alla pagina **Casi** con il modulo di creazione aperto. Clicca **"+ Nuovo Caso"** per procedere.', 
          [{ label: 'Vai a Casi', action: () => router.push('/cases') }]
        );
        router.push('/cases');
      });
      return;
    }

    if (q === '/cerca' || q.includes('cerca') || q.includes('search') || q.includes('neurosearch')) {
      simulateTyping(() => {
        addMsg('ai', '🔍 Ti porto su **NeuroSearch** — il motore di ricerca semantica AI per prove, casi e metadati.', 
          [{ label: 'Vai a NeuroSearch', action: () => router.push('/search') }]
        );
        router.push('/search');
      });
      return;
    }

    if (q === '/utenti' || q.includes('utenti') || q.includes('users') || q.includes('lista utenti')) {
      const active = DEMO_USERS.filter(u => u.isActive);
      const roles = DEMO_USERS.reduce((acc: Record<string, number>, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {});
      const roleStr = Object.entries(roles).map(([r, c]) => `${r}: ${c}`).join(', ');
      simulateTyping(() => {
        addMsg('ai', `👥 **Utenti sulla piattaforma:**\n\n• Totale: **${DEMO_USERS.length}**\n• Attivi: **${active.length}**\n• Ruoli: ${roleStr}`,
          [{ label: 'Gestione Utenti', action: () => router.push('/users') }]
        );
      });
      return;
    }

    if (q === '/audit' || q.includes('audit') || q.includes('log operazioni')) {
      const recent = DEMO_AUDIT_LOG.slice(0, 5);
      simulateTyping(() => {
        const list = recent.map(l => `• **${l.action}** — ${l.user.name} _(${new Date(l.createdAt).toLocaleDateString('it-IT')})_`).join('\n');
        addMsg('ai', `📋 **Ultimi eventi Audit Log:**\n\n${list}\n\nTotale eventi: **${DEMO_AUDIT_LOG.length}**`,
          [{ label: 'Vai ad Audit Log', action: () => router.push('/audit') }]
        );
      });
      return;
    }

    if (q === '/ai-status' || q.includes('status ai') || q.includes('engine') || q.includes('ai engine')) {
      const a = DEMO_ANALYTICS.aiProcessing;
      const total = a.completed + a.processing + a.pending + a.failed;
      const rate = Math.round(a.completed / total * 100);
      simulateTyping(() => {
        addMsg('ai', `🧠 **Status AI Engine:**\n\n• ✅ Completate: **${a.completed}** (${rate}%)\n• ⏳ In elaborazione: **${a.processing}**\n• 📋 In coda: **${a.pending}**\n• ❌ Errori: **${a.failed}**\n\nPerformance globale: **${rate >= 80 ? 'Ottima' : rate >= 60 ? 'Buona' : 'Da migliorare'}** 🟢`);
      });
      return;
    }

    if (q === '/mappa' || q.includes('città') || q.includes('mappa') || q.includes('geograf') || q.includes('location')) {
      const locations: Record<string, number> = {};
      DEMO_CASES.forEach(c => { if (c.locationName) { const city = c.locationName.split(',')[0]; locations[city] = (locations[city] || 0) + 1; } });
      const sorted = Object.entries(locations).sort((a, b) => b[1] - a[1]);
      simulateTyping(() => {
        const list = sorted.map(([city, count]) => `• **${city}**: ${count} casi`).join('\n');
        addMsg('ai', `🗺️ **Distribuzione geografica casi:**\n\n${list}`,
          [{ label: 'Vedi Analytics', action: () => router.push('/analytics') }]
        );
      });
      return;
    }

    // Search for a case by keyword
    if (q.includes('caso') || q.includes('case') || q.includes('trova') || q.includes('find')) {
      const keywords = q.replace(/caso|case|trova|find|mostra|show|apri|open/gi, '').trim();
      if (keywords.length > 1) {
        const found = DEMO_CASES.filter(c => 
          c.title.toLowerCase().includes(keywords) || 
          c.description.toLowerCase().includes(keywords) || 
          c.caseNumber.toLowerCase().includes(keywords) ||
          c.tags.some(t => t.toLowerCase().includes(keywords))
        );
        if (found.length > 0) {
          simulateTyping(() => {
            const list = found.slice(0, 5).map(c => `• **${c.caseNumber}** — ${c.title} _(${c.status})_`).join('\n');
            addMsg('ai', `🔎 Ho trovato **${found.length} casi** per "${keywords}":\n\n${list}`,
              found.slice(0, 3).map(c => ({ label: `Apri ${c.caseNumber}`, action: () => router.push(`/cases/${c.id}`) }))
            );
          });
          return;
        }
      }
    }

    // Delete / close case
    if (q.includes('elimina') || q.includes('delete') || q.includes('chiudi caso') || q.includes('close case')) {
      simulateTyping(() => {
        addMsg('ai', '⚠️ Per motivi di sicurezza, l\'eliminazione o chiusura di un caso richiede conferma manuale. Ti porto alla pagina del caso dove puoi procedere.\n\nSpecifica il numero del caso (es. "elimina CI-2026-0001") per procedere.');
      });
      return;
    }

    // Help
    if (q.includes('help') || q.includes('aiuto') || q.includes('cosa puoi') || q.includes('comandi')) {
      simulateTyping(() => {
        addMsg('ai', '💡 **Ecco cosa posso fare:**\n\n• 🔍 **Cercare casi** — "trova rapina" o "caso CI-2026-0001"\n• ➕ **Creare nuovi casi** — "crea nuovo caso"\n• 📊 **Report analytics** — "mostra statistiche"\n• 🚨 **Casi critici** — "mostra casi urgenti"\n• 👥 **Gestire utenti** — "lista utenti attivi"\n• 📋 **Audit log** — "ultimi log operazioni"\n• 🧠 **Status AI** — "status ai engine"\n• 🗺️ **Mappa casi** — "casi per città"\n• 🧭 **Navigare** — "vai a [pagina]"\n\nScrivi in linguaggio naturale, capisco l\'italiano! 🇮🇹');
      });
      return;
    }

    // Greetings
    if (q.match(/^(ciao|hey|hello|salve|buongiorno|buonasera|hi)/)) {
      simulateTyping(() => {
        addMsg('ai', `Ciao! 👋 Come posso aiutarti oggi? Stai visualizzando la pagina **${pathname}**.\n\nUsa i suggerimenti rapidi o scrivi una richiesta.`);
      });
      return;
    }

    // Page context awareness
    if (q.includes('dove sono') || q.includes('pagina attuale') || q.includes('where')) {
      const pageNames: Record<string, string> = { '/': 'Command Center', '/cases': 'Gestione Casi', '/search': 'NeuroSearch', '/analytics': 'Analytics', '/audit': 'Audit Log', '/users': 'Gestione Utenti' };
      simulateTyping(() => {
        addMsg('ai', `📍 Ti trovi su **${pageNames[pathname] || pathname}**.\n\nVuoi che ti aiuti con qualcosa in questa sezione?`);
      });
      return;
    }

    // Fallback — intelligent response
    simulateTyping(() => {
      addMsg('ai', `🤔 Non ho capito bene la richiesta "${raw.trim()}". Prova con:\n\n• **"aiuto"** per vedere tutti i comandi\n• **"trova [parola chiave]"** per cercare casi\n• **"vai a [pagina]"** per navigare\n• Oppure usa i suggerimenti rapidi qui sotto.`);
    });
  };

  const handleSend = () => {
    if (!input.trim()) return;
    processCommand(input);
  };

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
              <p className="text-sm font-bold text-ci-text">CrimeMind AI</p>
              <p className="text-[10px] text-purple-400">Assistente Investigativo • Online</p>
            </div>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
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
