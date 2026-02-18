import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY?.trim() });

const SYSTEM_PROMPT = `Sei un analista investigativo AI senior della piattaforma CrimeIntel 7.0 Omega.
Il tuo compito è fornire analisi forensi approfondite, correlazioni tra prove, valutazioni di rischio e raccomandazioni operative.

CAPACITÀ:
- Analisi forense di casi criminali
- Correlazione prove multimodali (immagini, video, audio, documenti, targhe)
- Profilazione criminale e analisi comportamentale
- Valutazione rischio e prioritizzazione investigativa
- Identificazione pattern e modus operandi
- Suggerimenti piste investigative
- Analisi timeline e ricostruzione eventi
- Valutazione catena di custodia prove

FORMATO RISPOSTA:
- Usa markdown con **grassetto** per punti chiave
- Struttura con sezioni chiare (## headers)
- Includi livello di confidenza (Alta/Media/Bassa) per ogni conclusione
- Fornisci sempre "Prossimi Passi Consigliati"
- Rispondi SEMPRE in italiano
- Sii dettagliato ma conciso (max 500 parole)`;

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Anthropic API key not configured' }, { status: 500 });
    }

    let userPrompt = '';

    switch (type) {
      case 'case_analysis':
        userPrompt = `Analizza questo caso investigativo e fornisci un'analisi completa:

CASO: ${data.title}
NUMERO: ${data.caseNumber}
STATUS: ${data.status}
PRIORITÀ: ${data.priority}
DESCRIZIONE: ${data.description || 'Non disponibile'}
LOCATION: ${data.locationName || 'Non specificata'}
TAGS: ${data.tags?.join(', ') || 'Nessuno'}
PROVE: ${data.evidenceCount || 0} prove raccolte
TIPI PROVE: ${data.evidenceTypes?.join(', ') || 'Non disponibili'}
DATA CREAZIONE: ${data.createdAt}

${data.evidence?.length > 0 ? `DETTAGLIO PROVE:\n${data.evidence.map((e: { fileName: string; type: string; aiStatus: string; fileSize: number }) => `- ${e.fileName} (${e.type}, AI: ${e.aiStatus}, ${(e.fileSize / 1024).toFixed(0)}KB)`).join('\n')}` : ''}

${data.fusion ? `RISULTATI HYPERFUSION:\nScore: ${(data.fusion.fusionScore * 100).toFixed(0)}%\nConfidenza: ${(data.fusion.confidence * 100).toFixed(0)}%` : ''}

Fornisci:
1. Valutazione generale del caso
2. Analisi delle prove disponibili
3. Correlazioni e pattern identificati
4. Profilo investigativo suggerito
5. Livello di rischio e urgenza
6. Prossimi passi consigliati`;
        break;

      case 'evidence_analysis':
        userPrompt = `Analizza questa prova forense:

FILE: ${data.fileName}
TIPO: ${data.type}
DIMENSIONE: ${(data.fileSize / 1024).toFixed(1)}KB
HASH: ${data.hash || 'Non disponibile'}
STATUS AI: ${data.aiStatus}
CASO ASSOCIATO: ${data.caseName || 'Non specificato'}
DATA RACCOLTA: ${data.createdAt}

${data.aiResults ? `RISULTATI AI PRECEDENTI:\n${JSON.stringify(data.aiResults, null, 2)}` : ''}

Fornisci:
1. Valutazione dell'integrità della prova
2. Analisi forense del tipo di file
3. Suggerimenti per ulteriori analisi AI
4. Rilevanza investigativa stimata
5. Catena di custodia: raccomandazioni`;
        break;

      case 'threat_assessment':
        userPrompt = `Genera una valutazione delle minacce basata sui seguenti dati:

CASI ATTIVI: ${data.activeCases}
CASI CRITICI: ${data.criticalCases}
HOT ZONES: ${data.hotZones?.map((hz: { area: string; riskLevel: number }) => `${hz.area} (rischio ${(hz.riskLevel * 100).toFixed(0)}%)`).join(', ') || 'Non disponibili'}
PATTERN RECENTI: ${data.patterns?.map((p: { name: string; confidence: number }) => `${p.name} (confidenza ${(p.confidence * 100).toFixed(0)}%)`).join(', ') || 'Non disponibili'}
ENTITÀ ALTO RISCHIO: ${data.highRiskEntities || 0}
ULTIMO AGGIORNAMENTO: ${new Date().toISOString()}

Fornisci:
1. Livello di minaccia generale (CRITICO/ALTO/MEDIO/BASSO)
2. Minacce prioritarie identificate
3. Correlazioni tra hot zones e pattern
4. Raccomandazioni operative immediate
5. Previsioni a breve termine (24-72h)`;
        break;

      default:
        userPrompt = data.prompt || 'Analisi non specificata';
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const reply = message.content[0].type === 'text' ? message.content[0].text : 'Errore nella generazione.';

    return NextResponse.json({ analysis: reply, model: 'claude-3.5-sonnet', type });
  } catch (error: unknown) {
    console.error('Anthropic API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
