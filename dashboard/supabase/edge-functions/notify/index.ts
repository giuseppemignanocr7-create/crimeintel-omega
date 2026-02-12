// ============================================================
// CRIMEINTEL 7.0 Ω — Edge Function: Notification Dispatcher
// Sends push/email/Slack notifications based on events
// Deploy: supabase functions deploy notify
// ============================================================

// @ts-nocheck — Deno runtime, not Next.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotifyPayload {
  type: 'case_critical' | 'evidence_uploaded' | 'fusion_completed' | 'report_ready' | 'security_alert' | 'system_announcement';
  user_ids?: string[];       // Specific users, or null for broadcast to admins
  title: string;
  body?: string;
  link?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  channels?: ('in_app' | 'email' | 'slack' | 'sms')[];
  metadata?: Record<string, unknown>;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const payload: NotifyPayload = await req.json();
    const { type, title, body, link, priority = 'normal', channels = ['in_app'], metadata = {} } = payload;

    if (!type || !title) {
      return new Response(JSON.stringify({ error: 'type and title required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determine recipients
    let userIds = payload.user_ids || [];
    if (userIds.length === 0) {
      // Default: notify all admins and supervisors
      const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .in('role', ['ADMIN', 'SUPERVISOR'])
        .eq('is_active', true);
      userIds = (admins || []).map((a: { id: string }) => a.id);
    }

    const results = {
      in_app: 0,
      email: 0,
      slack: 0,
      sms: 0,
    };

    // ── In-App Notifications ──
    if (channels.includes('in_app')) {
      const notifications = userIds.map(userId => ({
        user_id: userId,
        type,
        priority,
        title,
        body: body || null,
        link: link || null,
        metadata,
      }));

      const { error } = await supabase.from('notifications').insert(notifications);
      if (!error) results.in_app = notifications.length;
    }

    // ── Email Notifications ──
    if (channels.includes('email')) {
      // Get email settings
      const { data: settings } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'notifications')
        .single();

      const emailEnabled = settings?.value?.emailEnabled !== false;

      if (emailEnabled) {
        // Get user emails
        const { data: profiles } = await supabase
          .from('profiles')
          .select('email, name')
          .in('id', userIds);

        for (const profile of (profiles || [])) {
          // TODO: Integrate with actual email provider (Resend, SendGrid, etc.)
          // await sendEmail({
          //   to: profile.email,
          //   subject: `[CrimeIntel] ${title}`,
          //   html: `<h2>${title}</h2><p>${body || ''}</p>${link ? `<a href="${link}">Apri</a>` : ''}`,
          // });
          console.log(`[EMAIL STUB] To: ${profile.email} — ${title}`);
          results.email++;
        }
      }
    }

    // ── Slack Webhook ──
    if (channels.includes('slack')) {
      const { data: settings } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'notifications')
        .single();

      const slackWebhook = settings?.value?.slackWebhook;
      if (slackWebhook) {
        const priorityEmoji = priority === 'urgent' ? '🚨' : priority === 'high' ? '⚠️' : 'ℹ️';
        try {
          await fetch(slackWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: `${priorityEmoji} *${title}*\n${body || ''}\n${link ? `<${link}|Apri in CrimeIntel>` : ''}`,
            }),
          });
          results.slack = 1;
        } catch (e) {
          console.error('Slack webhook failed:', e);
        }
      }
    }

    // ── SMS (critical alerts only) ──
    if (channels.includes('sms') && (priority === 'urgent' || priority === 'high')) {
      const { data: settings } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'notifications')
        .single();

      if (settings?.value?.criticalAlertSMS) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('phone, name')
          .in('id', userIds)
          .not('phone', 'is', null);

        for (const profile of (profiles || [])) {
          // TODO: Integrate with SMS provider (Twilio, etc.)
          console.log(`[SMS STUB] To: ${profile.phone} — ${title}`);
          results.sms++;
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      recipients: userIds.length,
      channels_used: results,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
