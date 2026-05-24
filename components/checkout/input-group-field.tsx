'use client';

import React, {useState} from 'react';
import {Input} from '@/components/ui/input';
import {EventGroupType} from "@/db/schema";
import {useRouter, useSearchParams} from "next/navigation";

interface Props {
  eventId: number,
  existingGroups: EventGroupType[];
}

export function InputGroupField({ eventId, existingGroups }: Props) {
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter()
  const searchParams = useSearchParams();

  const handleCreate = () => {
    const trimmedName = groupName.trim();

    // Reset error
    setError('');

    // Validation
    if (!trimmedName) {
      setError('Group name cannot be empty');
      return;
    }

    // Check if group already exists
    if ((existingGroups || []).some((group) => group.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError(`"${trimmedName}" already exists. Try adding a number, e.g., '${trimmedName} 1'.`);
      return;
    }

    // Create group
    const newParam = new URLSearchParams(searchParams);
    newParam.set('group', groupName)
    router.push(`/event/${eventId}/register/group?${newParam}`)
  };

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
      <Input
        name="create-group"
        value={groupName}
        onChange={(e) => {
          setGroupName(e.target.value);
          setError('');
        }}
        onKeyDown={handleKeyPress}
        onBlur={() => handleOnBlur()}
        placeholder="Enter group name"
        className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
      />

      {error && (
        <div className="text-sm text-destructive font-medium">
          {error}
        </div>
      )}
    </div>
  );
}
