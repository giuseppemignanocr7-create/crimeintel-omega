// ============================================================
// CRIMEINTEL 7.0 Ω — Edge Function: Report Generation
// Generates forensic/summary/timeline reports for a case
// Deploy: supabase functions deploy report-generate
// ============================================================

// @ts-nocheck — Deno runtime, not Next.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Authenticate user
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { case_id, report_type = 'SUMMARY' } = await req.json();
    if (!case_id) {
      return new Response(JSON.stringify({ error: 'case_id required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch full case context via RPC
    const { data: caseData, error: caseError } = await supabaseClient
      .rpc('get_case_full', { p_case_id: case_id });

    if (caseError || !caseData) {
      return new Response(JSON.stringify({ error: 'Case not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create report record (PROCESSING)
    const reportTitle = `${caseData.case?.title || 'Case'} — ${report_type} Report`;
    const { data: report, error: reportError } = await supabaseClient.from('reports').insert({
      case_id,
      title: reportTitle,
      type: report_type,
      status: 'PROCESSING',
      created_by: user.id,
    }).select().single();

    if (reportError) throw reportError;

    // TODO: Replace with actual report generation (PDF, LLM summary, etc.)
    // Simulate report content generation
    const evidenceCount = caseData.evidence?.length || 0;
    const aiResultsCount = caseData.ai_results?.length || 0;
    const fusionScore = caseData.fusion?.fusion_score || null;

    const content = {
      generated_at: new Date().toISOString(),
      report_type,
      case_number: caseData.case?.case_number,
      case_title: caseData.case?.title,
      summary: caseData.fusion?.summary || caseData.case?.description,
      evidence_analyzed: evidenceCount,
      ai_modules_run: aiResultsCount,
      fusion_score: fusionScore,
      entities: caseData.fusion?.entities || [],
      recommendations: caseData.fusion?.recommendations || [],
      timeline_events: caseData.timeline?.length || 0,
      linked_cases: caseData.linked_cases?.length || 0,
      graph_nodes: caseData.graph_nodes?.length || 0,
    };

    const estimatedPages = report_type === 'FORENSIC' ? 25 + evidenceCount * 3 :
                           report_type === 'TIMELINE' ? 10 + (caseData.timeline?.length || 0) :
                           report_type === 'FUSION' ? 20 :
                           12;

    // Update report as completed
    await supabaseClient.from('reports').update({
      status: 'COMPLETED',
      content,
      pages: estimatedPages,
      file_size: JSON.stringify(content).length * 10, // Approximate
    }).eq('id', report.id);

    // Add timeline event
    await supabaseClient.from('case_timeline').insert({
      case_id,
      event_type: 'report_generated',
      title: `Report ${report_type} generato`,
      description: `${estimatedPages} pagine, ${evidenceCount} prove analizzate.`,
      actor_id: user.id,
      metadata: { report_id: report.id, type: report_type, pages: estimatedPages },
    });

    // Audit log
    await supabaseClient.from('audit_log').insert({
      user_id: user.id,
      action: 'REPORT_GENERATED',
      resource: 'report',
      target_id: case_id,
      details: { report_id: report.id, type: report_type },
    });

    return new Response(JSON.stringify({
      success: true,
      report_id: report.id,
      type: report_type,
      pages: estimatedPages,
      status: 'COMPLETED',
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
