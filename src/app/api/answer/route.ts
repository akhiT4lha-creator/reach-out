import { getGuide } from "@/data/pulse/guides";
import type { AnswerError } from "@/lib/pulse/contract";
import { checkOutput, eligibleSources, getProvider, safetyNotice, validateRequest } from "@/lib/pulse/server";

function fail(status: number, code: AnswerError["code"], error: string) {
  return Response.json({ error, code } satisfies AnswerError, { status, headers: { "Cache-Control": "no-store" } });
}

// One chat question. Nothing is logged or stored here.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "bad_request", "Send a JSON body.");
  }
  const req = validateRequest(body);
  if (typeof req === "string") return fail(400, "bad_request", req);

  const urgent = safetyNotice(req.question);
  if (urgent) return Response.json(urgent, { headers: { "Cache-Control": "no-store" } });

  const provider = getProvider();
  if (!provider) {
    return fail(
      503,
      "not_configured",
      "AI connection unavailable. No model is connected to this version of PULSE, so no reply was generated.",
    );
  }

  const eligible = eligibleSources(req.service, req.guide);
  let output;
  try {
    output = await provider.generate({ request: req, guide: getGuide(req.guide)!, eligible });
  } catch {
    return fail(502, "provider_error", "The AI service didn’t respond. Try again in a moment.");
  }
  try {
    return Response.json(checkOutput(output, eligible), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return fail(502, "invalid_output", "The reply didn’t pass PULSE’s checks, so it wasn’t shown. Try asking again.");
  }
}
