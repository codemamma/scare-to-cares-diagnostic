import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AssessmentPayload {
  email: string;
  name?: string;
  overallScore: number;
  categoryScores: {
    communication: number;
    adaptation: number;
    relationships: number;
    stressResponse: number;
    alignment: number;
  };
  recommendedChapters: Array<{
    chapter: string;
    title: string;
    summary: string;
  }>;
  recommendedActions: Array<{
    title: string;
    description: string;
  }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: AssessmentPayload = await req.json();

    if (!payload.email || !payload.email.includes("@")) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Valid email is required",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { data: assessment, error: insertError } = await supabase
      .from("assessments")
      .insert({
        email: payload.email,
        name: payload.name || null,
        overall_score: payload.overallScore,
        communication_score: payload.categoryScores.communication,
        adaptation_score: payload.categoryScores.adaptation,
        relationships_score: payload.categoryScores.relationships,
        stress_response_score: payload.categoryScores.stressResponse,
        alignment_score: payload.categoryScores.alignment,
        recommended_chapters: payload.recommendedChapters,
        recommended_actions: payload.recommendedActions,
        report_sent: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to save assessment",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    let emailSent = false;
    let emailError = null;

    if (resendApiKey) {
      try {
        const emailHtml = generateEmailHtml(payload);

        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "CARES Assessment <onboarding@resend.dev>",
            to: [payload.email],
            subject: "Your SCARE to CARES Assessment Report",
            html: emailHtml,
          }),
        });

        if (emailResponse.ok) {
          emailSent = true;
          await supabase
            .from("assessments")
            .update({ report_sent: true })
            .eq("id", assessment.id);
        } else {
          const errorData = await emailResponse.json();
          emailError = errorData.message || "Email sending failed";
        }
      } catch (error) {
        console.error("Email error:", error);
        emailError = error.message;
      }
    } else {
      emailError = "Resend API key not configured";
    }

    return new Response(
      JSON.stringify({
        success: true,
        assessmentId: assessment.id,
        message: emailSent
          ? "Your report has been sent to your email."
          : "Assessment saved. Email could not be sent at this time.",
        emailSent,
        emailError,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function generateEmailHtml(payload: AssessmentPayload): string {
  const chaptersHtml = payload.recommendedChapters
    .map(
      (ch) => `
    <div style="margin-bottom: 20px; padding: 15px; background: #f9fafb; border-left: 4px solid #2563eb; border-radius: 4px;">
      <div style="color: #2563eb; font-weight: 600; font-size: 14px; margin-bottom: 5px;">${ch.chapter}</div>
      <div style="font-weight: 600; font-size: 16px; margin-bottom: 5px;">${ch.title}</div>
      <div style="color: #6b7280; font-size: 14px;">${ch.summary}</div>
    </div>
  `
    )
    .join("");

  const scoresHtml = `
    <div style="margin-bottom: 20px;">
      <div style="margin-bottom: 10px;">
        <strong>Communication:</strong> ${payload.categoryScores.communication}/10
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Adaptation:</strong> ${payload.categoryScores.adaptation}/10
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Relationships:</strong> ${payload.categoryScores.relationships}/10
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Stress Response:</strong> ${payload.categoryScores.stressResponse}/10
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Alignment:</strong> ${payload.categoryScores.alignment}/10
      </div>
    </div>
  `;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your CARES Assessment Report</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #111827; margin-bottom: 10px;">Your SCARE to CARES Assessment Report</h1>
    <p style="color: #6b7280; font-size: 18px;">Overall Score: ${payload.overallScore}/10</p>
  </div>

  <div style="margin-bottom: 30px;">
    <h2 style="color: #111827; margin-bottom: 15px;">Your Category Scores</h2>
    ${scoresHtml}
  </div>

  <div style="margin-bottom: 30px;">
    <h2 style="color: #111827; margin-bottom: 15px;">Recommended Chapters</h2>
    <p style="color: #6b7280; margin-bottom: 15px;">Based on your assessment, these chapters will help you strengthen your leadership capabilities.</p>
    ${chaptersHtml}
  </div>

  <div style="margin-bottom: 30px;">
    <h2 style="color: #111827; margin-bottom: 15px;">Next Steps</h2>

    <div style="margin-bottom: 20px; padding: 20px; background: #eff6ff; border-radius: 8px;">
      <h3 style="color: #1e40af; margin-top: 0;">📚 Get the Toolkit</h3>
      <p style="margin-bottom: 10px;">Complete toolkit with frameworks and exercises</p>
      <a href="https://forms.gle/YOUR_TOOLKIT_FORM_ID" style="color: #2563eb; text-decoration: none; font-weight: 600;">More Details →</a>
    </div>

    <div style="margin-bottom: 20px; padding: 20px; background: #faf5ff; border-radius: 8px;">
      <h3 style="color: #7c3aed; margin-top: 0;">👥 Book Workshop</h3>
      <p style="margin-bottom: 10px;">Cohort-based CARES framework training</p>
      <a href="https://forms.gle/YOUR_WORKSHOP_FORM_ID" style="color: #7c3aed; text-decoration: none; font-weight: 600;">More Details →</a>
    </div>

    <div style="margin-bottom: 20px; padding: 20px; background: #eef2ff; border-radius: 8px;">
      <h3 style="color: #4f46e5; margin-top: 0;">💼 1:1 Strategy Session</h3>
      <p style="margin-bottom: 10px;">Work directly with Saby Waraich</p>
      <a href="https://calendly.com/saby-waraich" style="color: #4f46e5; text-decoration: none; font-weight: 600;">Book Session →</a>
    </div>
  </div>

  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
    <p>Transform your leadership with the SCARE to CARES framework</p>
    <p style="margin-top: 10px;">
      <a href="https://sabywaraich.com/resources" style="color: #2563eb; text-decoration: none;">Order on Amazon</a>
    </p>
  </div>

</body>
</html>
  `;
}
