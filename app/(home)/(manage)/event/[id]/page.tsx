import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import Link from "next/link";

export default async function Page({params,}: { params: Promise<{ id: number }> }) {

  const {id} = await params;

  const event = await getEventById(id);

  if (!event) {
    redirect('/');
  }

  return (
    <div>
      Show Event Details

      <Link href={`/event/${id}/order`}>
        Join
      </Link>
    </div>
  )
}