import { getStats } from "@/app/lib/system";

export async function GET() {
  const stats = await getStats();
  return Response.json(stats);
}
