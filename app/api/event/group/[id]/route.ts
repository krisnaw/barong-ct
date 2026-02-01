import {NextRequest, NextResponse} from "next/server";
import {db} from "@/db/db";
import {eq} from "drizzle-orm";
import {eventGroup} from "@/db/schema";

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/event/group/[id]'>) {
  const { id } = await ctx.params
  const group = await db.query.eventGroup.findFirst({
    where: eq(eventGroup.id, Number(id))
  })
  if (!group) {
    return NextResponse.json({error: "Group not found"}, {status: 400})
  }
  return NextResponse.json({ group }, {status: 200})
}