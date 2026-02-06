import {Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item";
import {CirclePile} from "lucide-react";
import {GroupWithParticipant} from "@/db/schema";

export function GroupItem({ group }: { group: GroupWithParticipant }) {
  return (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <CirclePile />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          {group.name}
        </ItemTitle>
        <div className="line-clamp-none">
          <ul className="grid grid-cols-2 list-disc list-inside">
            {group.participants.map((name: string, index: number) => (
              <li
                className="text-muted-foreground text-sm leading-normal font-normal text-balance"
                key={index}>{name}</li>
            ))}
          </ul>
        </div>
      </ItemContent>
      <ItemActions>
        <ItemDescription>
          {group.participants.length}/5 members
        </ItemDescription>
      </ItemActions>
    </Item>
  )
}