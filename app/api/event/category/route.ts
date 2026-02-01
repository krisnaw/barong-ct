import {NextRequest, NextResponse} from "next/server";
import {db} from "@/db/db";
import {and, like} from "drizzle-orm";
import {eventGroup} from "@/db/schema";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const groups = await db.query.eventGroup.findMany({
    where: and(
      like(eventGroup.name, `%${body.name}%`),
    )
  })

  console.log(groups);


  return NextResponse.json({message: "success"}, { status: 200, });
}