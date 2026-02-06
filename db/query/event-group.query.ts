'use server'

import {db} from "@/db/db";
import {eq} from "drizzle-orm";
import {eventGroup, GroupWithParticipant} from "@/db/schema";

export async function getGroupByEvent(eventId: number) {
  const query = await db.query.eventGroup.findMany({
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

  const groups =  query.map(group => ({
    ...group,
    participants: group.eventOrders
      .map(order => order.participant?.user?.name)
      .filter(Boolean)
  }));

  return groups as unknown as GroupWithParticipant[]
}