'use client'
import {useQueryState} from "nuqs";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {Search} from "lucide-react";

export function InputSearch() {
  const [name, setName] = useQueryState('name', { shallow: false });
  return (
    <div>
      <InputGroup>
        <InputGroupInput
          value={name || ''} onChange={e => setName(e.target.value)}
          placeholder="Search by name" />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}