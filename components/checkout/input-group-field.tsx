'use client';

import React from 'react';
import {Input} from '@/components/ui/input';
import {EventGroupType} from "@/db/schema";
import {useRouter, useSearchParams} from "next/navigation";

import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";

interface Props {
  eventId: number,
  existingGroups: EventGroupType[];
}

export function InputGroupField({ eventId, existingGroups }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams();
  const groupId = searchParams.get('groupId');
  const selectedGroup = groupId ? existingGroups.find((g) => String(g.id) === groupId) : null;
  const groupName = selectedGroup?.name ?? searchParams.get('group') ?? "";

  const handleCreate = () => {
    const trimmedName = groupName.trim();

    // Validation
    if (!trimmedName) return;

    // Check if group already exists
    if ((existingGroups || []).some((group) => group.name.toLowerCase() === trimmedName.toLowerCase())) {
      return;
    }

    const newParam = new URLSearchParams(searchParams);
    newParam.set('group', groupName)
    router.push(`/event/${eventId}/register/group?${newParam}`)
  };

  const handleChange = (value: string) => {
    const newParam = new URLSearchParams(searchParams);
    newParam.set('group', value)
    newParam.delete('groupId')
    router.push(`/event/${eventId}/register/group?${newParam}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  const handleOnBlur = () => {
    if (!groupName.trim()) return
    handleCreate()
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          name="create-group"
          value={groupName}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={() => handleOnBlur()}
          placeholder="Enter group name"
        />
        <Button onClick={handleCreate} className="gap-2" disabled={groupName.length === 0}>
          <Plus className="h-4 w-4" />
          Create
        </Button>
      </div>
    </div>
  );
}
