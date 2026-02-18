import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY?.trim() });

const SYSTEM_PROMPT = `Sei **CrimeMind**, l'assistente AI investigativo della piattaforma CrimeIntel 7.0 Omega.
Sei un esperto di intelligence criminale, analisi forense, investigazioni e sicurezza.

CONTESTO PIATTAFORMA:
- CrimeIntel è una piattaforma AI-native per investigazioni forensi usata dalle forze dell'ordine italiane
- Ha 7 moduli AI: YOLOv8 (object detection), FaceRec (riconoscimento facciale), LPR (targhe), Thermal, Satellite, Audio Forensics, Video Analysis
- HyperFusion: fusione multimodale di tutte le prove AI
- CrimeGraph: grafo investigativo Neo4j per entità e relazioni
- NeuroSearch: ricerca semantica AI
- Predictive Intelligence: hot zones, risk scoring, pattern recognition

DATI ATTUALI (DEMO):
- 8 casi attivi tra cui: Rapina Via Roma (Milano), Cybercrime Ring (Roma), Traffico Porto Gioia Tauro, Sequestro Torino, Frode Bancaria Napoli
- 156 prove totali (48 immagini, 32 video, 45 documenti, 18 audio, 13 targhe)
- 7 moduli AI attivi con 99.97% uptime
- 12 utenti sulla piattaforma (Admin, Supervisor, Investigator, Analyst, Viewer)
- Hot zones: Milano Centro (92% rischio), Roma Termini (87%), Napoli Porto (85%)

COMPORTAMENTO:
- Rispondi SEMPRE in italiano a meno che l'utente non scriva in un'altra lingua
- Sii professionale ma accessibile
- Fornisci analisi investigative concrete quando possibile
- Suggerisci azioni investigative e correlazioni tra casi
- Usa emoji con moderazione per rendere le risposte più leggibili
- Se ti chiedono di navigare, suggerisci la pagina appropriata
- Puoi analizzare pattern criminali, suggerire piste investigative, correlare prove
- Mantieni le risposte concise (max 300 parole) ma informative
- Formatta con **grassetto** per punti chiave e elenchi puntati per liste

PAGINE DISPONIBILI: /, /cases, /cases/[id], /search, /analytics, /audit, /ai-engine, /crimegraph, /predictive, /reports, /competitors, /users, /settings, /security-dashboard`;

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const systemMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    if (context) {
      systemMessages.push({
        role: 'system',
        content: `CONTESTO ATTUALE: L'utente sta visualizzando la pagina "${context.page}". ${context.extra || ''}`,
      });
    }

    const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      ...systemMessages,
      ...messages.slice(-20).map((m: { role: string; text: string }) => ({
        role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
        content: m.text,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: chatMessages,
      max_tokens: 800,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || 'Errore nella generazione della risposta.';

    return NextResponse.json({ reply, model: 'gpt-4o' });
  } catch (error: unknown) {
    console.error('OpenAI API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
