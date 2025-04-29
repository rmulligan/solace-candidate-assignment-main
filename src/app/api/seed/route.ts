// import db dynamically inside handler to avoid build-time initialization
// import db from "../../../db";
// Disable prerendering to avoid build-time DB initialization
export const dynamic = 'force-dynamic';
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function POST() {
  // Dynamically import db to avoid import-time errors
  const { default: db } = await import("../../../db");
  const records = await db.insert(advocates).values(advocateData).returning();

  return Response.json({ advocates: records });
}
