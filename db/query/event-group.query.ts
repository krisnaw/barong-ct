'use server'

import {db} from "@/db/db";
import {eq} from "drizzle-orm";
import {eventGroup, GroupWithParticipant} from "@/db/schema";

export async function getGroupById(groupId: number) {
  const query = await db.query.eventGroup.findFirst({
    where: eq(eventGroup.id, groupId),
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
  })

  if (!query) {
    return null
  }

  const group =  {
    ...query,
    participants: query.eventOrders
      .map(order => order.participant?.user?.name)
      .filter(Boolean)
  };
  return group as unknown as GroupWithParticipant;
}

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

  const groups = query.map(group => ({
    ...group,
    participants: group.eventOrders
      .map(order => order.participant?.user?.name)
      .filter(Boolean)
  }));

  return groups as unknown as GroupWithParticipant[]
}