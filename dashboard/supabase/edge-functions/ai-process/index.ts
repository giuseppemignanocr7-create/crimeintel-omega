// ============================================================
// CRIMEINTEL 7.0 Ω — Edge Function: AI Processing Pipeline
// Triggered when new evidence is uploaded
// Deploy: supabase functions deploy ai-process
// ============================================================

// @ts-nocheck — Deno runtime, not Next.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIModule {
  name: string;
  supportedTypes: string[];
  version: string;
}

const AI_MODULES: AIModule[] = [
  { name: 'yolov8', supportedTypes: ['IMAGE', 'VIDEO'], version: 'v8.1.0' },
  { name: 'facerec', supportedTypes: ['IMAGE', 'VIDEO'], version: 'v2.4.0' },
  { name: 'lpr', supportedTypes: ['IMAGE', 'VIDEO', 'PLATE'], version: 'v3.1.0' },
  { name: 'audio_nlp', supportedTypes: ['AUDIO'], version: 'v1.8.0' },
  { name: 'document_ocr', supportedTypes: ['DOCUMENT'], version: 'v2.1.0' },
  { name: 'thermal', supportedTypes: ['THERMAL'], version: 'v1.5.0' },
  { name: 'satellite', supportedTypes: ['SATELLITE'], version: 'v1.2.0' },
];

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { evidence_id, case_id } = await req.json();
    if (!evidence_id || !case_id) {
      return new Response(JSON.stringify({ error: 'evidence_id and case_id required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get evidence details
    const { data: evidence, error: evError } = await supabaseClient
      .from('evidence')
      .select('*')
      .eq('id', evidence_id)
      .single();

    if (evError || !evidence) {
      return new Response(JSON.stringify({ error: 'Evidence not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Mark as processing
    await supabaseClient.from('evidence').update({ ai_status: 'PROCESSING' }).eq('id', evidence_id);

    // Determine applicable AI modules
    const applicableModules = AI_MODULES.filter(m =>
      m.supportedTypes.includes(evidence.file_type)
    );

    const results = [];

    for (const module of applicableModules) {
      const startTime = Date.now();

      // TODO: Replace with actual AI inference API calls
      // This is a stub that simulates processing
      const inferenceResult = {
        module: module.name,
        engine_version: module.version,
        confidence: 0.85 + Math.random() * 0.13,
        result_type: module.name === 'yolov8' ? 'object_detection' :
                     module.name === 'facerec' ? 'face_recognition' :
                     module.name === 'lpr' ? 'plate_recognition' :
                     module.name === 'audio_nlp' ? 'speech_analysis' :
                     module.name === 'document_ocr' ? 'text_extraction' :
                     module.name === 'thermal' ? 'thermal_analysis' :
                     'anomaly_detection',
        result_data: { status: 'processed', module: module.name, timestamp: new Date().toISOString() },
      };

      const inferenceMs = Date.now() - startTime;

      // Store AI result
      const { error: insertError } = await supabaseClient.from('ai_results').insert({
        evidence_id,
        case_id,
        module: inferenceResult.module,
        engine_version: inferenceResult.engine_version,
        inference_ms: inferenceMs,
        confidence: inferenceResult.confidence,
        result_type: inferenceResult.result_type,
        result_data: inferenceResult.result_data,
      });

      if (!insertError) results.push(inferenceResult);
    }

    // Update evidence status and AI results
    await supabaseClient.from('evidence').update({
      ai_status: 'COMPLETED',
      ai_results: results.length > 0 ? results[0].result_data : {},
    }).eq('id', evidence_id);

    // Add timeline event
    await supabaseClient.from('case_timeline').insert({
      case_id,
      event_type: 'ai_analysis',
      title: `AI: ${applicableModules.map(m => m.name).join(', ')}`,
      description: `${results.length} moduli AI completati per ${evidence.file_name}`,
      metadata: { modules: applicableModules.map(m => m.name), evidence_id },
    });

    // Audit log
    await supabaseClient.from('audit_log').insert({
      action: 'AI_ANALYSIS_RUN',
      resource: 'ai_engine',
      target_id: evidence_id,
      details: { modules: applicableModules.map(m => m.name), results_count: results.length },
    });

    return new Response(JSON.stringify({
      success: true,
      evidence_id,
      modules_run: results.length,
      results,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
