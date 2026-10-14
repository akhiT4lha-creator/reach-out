import { connection } from "next/server";
import type { ConnectionStatus } from "@/lib/pulse/contract";
import { getProvider } from "@/lib/pulse/server";

// Tells the chat whether a model is connected. Checked per request so that
// adding a provider key does not need a rebuild.
export async function GET() {
  await connection();
  const provider = getProvider();
  const body: ConnectionStatus = provider
    ? { liveConfigured: true, reason: "connected", provider: provider.name }
    : { liveConfigured: false, reason: "no-provider" };
  return Response.json(body, { headers: { "Cache-Control": "no-store" } });
}
