import {Item, ItemActions, ItemContent, ItemMedia, ItemTitle,} from "@/components/ui/item"
import {CalendarIcon, Pencil} from "lucide-react";
import {EventCategoryType} from "@/db/schema";
import {Button} from "@/components/ui/button";

export async function EventCategories({categories} : {categories: EventCategoryType[]}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
      {categories.map(category => (
        <Item variant="outline" key={category.id}>
          <ItemMedia variant="icon">
            <CalendarIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{category.name}</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Button
              size="icon-sm"
              variant="outline"
              className="rounded-full"
              aria-label="Invite"
            >
              <Pencil />
            </Button>
          </ItemActions>
        </Item>
      ))}
    </div>
  )
}