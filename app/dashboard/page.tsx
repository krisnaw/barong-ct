import {db} from "@/db/db";
import {user} from "@/db/schema";

export default async function Page() {
  const events = await db.select().from(user).limit(1);
  console.log(events);
  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </>
  )
}