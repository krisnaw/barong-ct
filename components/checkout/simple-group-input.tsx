'use client';

import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Plus} from 'lucide-react';
import {GroupWithParticipant} from "@/db/schema";

interface CreateGroupSimpleProps {
  existingGroups: GroupWithParticipant[];
  onCreate?: (groupName: string) => void;
  placeholder?: string;
}

export function SimpleGroupInput({
                                    existingGroups,
                                    onCreate,
                                    placeholder = 'Enter group name...',
                                  }: CreateGroupSimpleProps) {
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');

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
    if (
      existingGroups.some(
        (group) => group.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      setError(`"${trimmedName}" already exists`);
      return;
    }

    // Create group
    onCreate?.(trimmedName);
    setGroupName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={groupName}
          onChange={(e) => {
            setGroupName(e.target.value);
            setError('');
          }}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        <Button onClick={handleCreate} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Create
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
