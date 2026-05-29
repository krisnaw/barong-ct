'use client';

import React, {useState} from 'react';
import {Input} from '@/components/ui/input';
import {EventGroupType} from "@/db/schema";
import {useRouter, useSearchParams} from "next/navigation";

import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";

interface Props {
  eventId: number,
  existingGroups: EventGroupType[];
  groupId?: string | null;
}

export function InputGroupField({ eventId, existingGroups, groupId }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams();
  const [groupName, setGroupName] = useState<string>(searchParams.get("group") ?? "")
  const [error, setError] = useState('');

  const handleChange = (value: string) => {
    setGroupName(value)
    setError("")
  }

  const handleCreate = () => {
    const trimmedName = groupName.trim();

    // Validation
    if (!trimmedName) return;

    // Check if group already exists
    if ((existingGroups || []).some((group) => group.name.toLowerCase() === trimmedName.toLowerCase())) {
      const newParam = new URLSearchParams(searchParams);
      newParam.delete('group', groupName)
      router.push(`/event/${eventId}/register/group?${newParam}`)
      setError(`"${trimmedName}" already exists. Try adding a number, e.g., '${trimmedName} 1'.`);
      return;
    } else {
      const newParam = new URLSearchParams(searchParams);
      newParam.set('group', groupName)
      router.push(`/event/${eventId}/register/group?${newParam}`)
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          name="create-group"
          value={groupName}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter group name"
          disabled={!!groupId}
        />
        <Button onClick={handleCreate} className="gap-2" disabled={!!groupId || groupName.length === 0}>
          <Plus className="h-4 w-4" />
          Add Group
        </Button>
      </div>
      {error && (
        <div className="text-sm text-destructive font-medium">
          {error}
        </div>
      )}
    </div>
  );
}
