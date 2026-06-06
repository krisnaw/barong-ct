import {getEventById} from "@/db/query/event-query";
import {redirect} from "next/navigation";
import {getCategoryByEvent} from "@/db/query/event-category.query";
import {getGroupsByEvent} from "@/db/query/event-group.query";
import {getPromoByEvent} from "@/db/query/event-promo.query";
import {AdminRegisterForm} from "./admin-register-form";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {ChevronLeft} from "lucide-react";

export default async function Page({params}: { params: Promise<{ id: number }> }) {
  const {id} = await params
  const event = await getEventById(id)
  if (!event) redirect('/dashboard/events')

  const [categories, groups, promos] = await Promise.all([
    getCategoryByEvent(id),
    getGroupsByEvent(id),
    getPromoByEvent(id, true),
  ])

  return (
    <div className="space-y-4">
      <div>
        <Link
          className={buttonVariants({variant: "ghost", size: "sm"})}
          href={`/dashboard/events/${id}`}
        >
          <ChevronLeft className="size-4"/>
          Back to event
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Register Participant</h1>
        <p className="text-sm text-muted-foreground">{event.name}</p>
      </div>

      <AdminRegisterForm categories={categories} groups={groups} promos={promos}/>
    </div>
  )
}
