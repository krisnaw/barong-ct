'use client'

import {EventGroupType} from "@/db/schema";
import {useQueryState} from "nuqs";
import {Button} from "@/components/ui/button";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export function GroupList({groups} : {groups : EventGroupType[]}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const category = searchParams.get("category") as string
  const newPath = pathname.replace(/\/[^/]+$/, `/profile`);
  const router = useRouter();
  const [, setGroup] = useQueryState('group', { shallow: true });

  function onClickHandler(groupId: string) {
    router.push(`${newPath}?category=${category}&groupId=${groupId}`);
  }

  return (
    <div>
      {groups.map((group) => (
        <div key={group.id}>
          <Button onClick={() => onClickHandler(String(group.id))}>
            {group.name}
          </Button>
        </div>
      ))}
    </div>
  )
}