'use server'

import {db} from "@/db/db";
import {eq} from "drizzle-orm";
import {eventGroup} from "@/db/schema";

export async function getGroupByEvent(eventId: number) {
  const groups = await db.query.eventGroup.findMany({
    where: eq(eventGroup.eventId, eventId),
    with: {
      eventOrders: {
        with: {
          participant: {
            with: {
              user: {
                columns: {
                  name: true
                }
              }
            }
          }
        }
      }
    }
  });

  return groups.map(group => ({
    ...group,
    participants: group.eventOrders
      .map(order => order.participant?.user?.name)
      .filter(Boolean)
  }));
}