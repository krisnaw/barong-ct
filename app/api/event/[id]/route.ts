import {NextRequest, NextResponse} from "next/server";
import {db} from "@/db/db";
import {and, eq, ilike} from "drizzle-orm";
import {eventGroup} from "@/db/schema";

export async function GET(request: NextRequest, ctx: RouteContext<'/api/event/[id]'>) {
  const {id} = await ctx.params

  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  const groupId = searchParams.get('group')
  const name = searchParams.get('name')

  console.log('category', category)
  console.log('name', name)
  console.log('groupId', groupId)

  // Search group by event id and category and name
  const groups = await db.query.eventGroup.findMany({
    where: and(
      eq(eventGroup.eventId, Number(id)),
      eq(eventGroup.eventCategoryId, Number(category)),
      ilike(eventGroup.name, `%${name}%`),
    )
  })

  if (!groups) {
    return NextResponse.json({status: 404})
  }

  return NextResponse.json({groups}, {status: 200})
}