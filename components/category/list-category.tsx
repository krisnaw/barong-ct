import {Item, ItemActions, ItemContent, ItemDescription, ItemTitle,} from "@/components/ui/item"
import {Pencil} from "lucide-react";
import {EventCategoryType} from "@/db/schema";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export async function ListCategory({categories} : {categories: EventCategoryType[]}) {
  console.log(categories);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
      {categories.map(category => (
        <Item variant="outline" key={category.id}>
          <ItemContent>
            <ItemTitle>{category.name}</ItemTitle>
            <ItemDescription>{category.description}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              size="icon-sm"
              variant="outline"
              className="rounded-full"
              aria-label="Invite"
            >
              <Link href={`/dashboard/events/${category.eventId}/category/${category.id}/edit`}>
                <Pencil />
              </Link>
            </Button>
          </ItemActions>
        </Item>
      ))}
    </div>
  )
}