import {NextRequest, NextResponse} from "next/server";
import {db} from "@/db/db";
import {and, eq, ilike} from "drizzle-orm";
import {eventGroup} from "@/db/schema";

export async function GET(request: NextRequest, ctx: RouteContext<'/api/event/[id]'>) {
  const {id} = await ctx.params

  const searchParams = request.nextUrl.searchParams
  const name = searchParams.get('name')

  // Search group by eventId and name
  const groups = await db.query.eventGroup.findMany({
    where: and(
      eq(eventGroup.eventId, Number(id)),
      ilike(eventGroup.name, `%${name}%`),
    )
  })

  if (!groups) {
    return NextResponse.json({status: 404})
  }

  return NextResponse.json({groups}, {status: 200})
}