import {Item, ItemContent, ItemMedia, ItemTitle} from "@/components/ui/item";
import {CirclePile} from "lucide-react";
import {EventGroupType} from "@/db/schema";

export function GroupItem({ group }: { group: EventGroupType }) {
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
          {/*<ul className="grid grid-cols-2 list-disc list-inside">*/}
          {/*  {group.participants.map((name: string, index: number) => (*/}
          {/*    <li*/}
          {/*      className="text-muted-foreground text-sm leading-normal font-normal text-balance"*/}
          {/*      key={index}>{name}</li>*/}
          {/*  ))}*/}
          {/*</ul>*/}
        </div>
      </ItemContent>
      {/*{group.participants.length > 0 && (*/}
      {/*  <ItemActions>*/}
      {/*    <ItemDescription>*/}
      {/*      {group.participants.length}/5 members*/}
      {/*    </ItemDescription>*/}
      {/*  </ItemActions>*/}
      {/*)}*/}
    </Item>
  )
}