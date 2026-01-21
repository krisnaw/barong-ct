'use client'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useQueryState} from "nuqs";

export function FilterCompleteProfile() {
  const [profile, setProfile] = useQueryState('profile', { shallow: false });
  return (
    <Select defaultValue="all" onValueChange={(e) => setProfile(e)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
        <SelectItem value="incomplete">Incomplete</SelectItem>
      </SelectContent>
    </Select>
  )
}