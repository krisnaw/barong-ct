'use client';

import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Plus} from 'lucide-react';
import {GroupWithParticipant} from "@/db/schema";
import {toast} from "sonner";
import {createGroupAction} from "@/app/actions/event-group/event-group.action";
import {useRouter, useSearchParams} from "next/navigation";

interface Props {
  eventId: number,
  orderId: number,
  existingGroups: GroupWithParticipant[];
}

export function InputGroupField({ eventId, orderId,existingGroups }: Props) {
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
    if (
      existingGroups.some(
        (group) => group.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      setError(`"${trimmedName}" already exists. Try adding a number, e.g., '${trimmedName} 1'.`);
      return;
    }

    // Create group
    createGroup?.(trimmedName);
    setGroupName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  async function createGroup(value: string) {
    if (!value) return;
    const res = await createGroupAction({
      name: value,
      eventId,
      orderId,
    })

    if (res.success && res.data) {
      const newParam = new URLSearchParams(searchParams);
      // @ts-ignore
      newParam.set('group', String(res.data.id))
      router.push(`/event/${eventId}/register/group?${newParam}`)
      toast.success(res.message);
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          name="create-group"
          value={groupName}
          onChange={(e) => {
            setGroupName(e.target.value);
            setError('');
          }}
          onKeyDown={handleKeyPress}
          placeholder="Enter group name"
          className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        <Button onClick={handleCreate} className="gap-2" disabled={groupName.length === 0}>
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
