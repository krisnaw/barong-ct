'use client';

import React, {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Plus, Search} from 'lucide-react';
import {GroupWithParticipant} from "@/db/schema";

interface SearchGroupInputProps {
  availableGroups?: GroupWithParticipant[];
  onSearch?: (value: string) => void;
  onCreate?: (groupName: string) => void;
  onSelectGroup?: (group: GroupWithParticipant) => void;
  placeholder?: string;
  createButtonText?: string;
  maxMembers?: number;
}

export function SearchGroupInput({
                                   availableGroups = [],
                                   onSearch,
                                   onCreate,
                                   onSelectGroup,
                                   placeholder = 'Search groups or create group',
                                   createButtonText = 'Create Group',
                                   maxMembers = 5,
                                 }: SearchGroupInputProps) {
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredGroups = searchValue.trim()
    ? availableGroups.filter((group: GroupWithParticipant) =>
      group.name.toLowerCase().includes(searchValue.toLowerCase())
    )
    : availableGroups;

  const groupExists = availableGroups.some(
    (group) => group.name.toLowerCase() === searchValue.toLowerCase()
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setIsOpen(true);
    onSearch?.(value);
  };

  const handleSelectGroup = (group: GroupWithParticipant) => {
    onSelectGroup?.(group);
    setSearchValue('');
    setIsOpen(false);
  };

  const handleCreateGroup = async () => {
    if (searchValue.trim() && !groupExists) {
      onCreate?.(searchValue.trim());
      setSearchValue('');
      setIsOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (filteredGroups.length > 0) {
        handleSelectGroup(filteredGroups[0]);
      } else if (searchValue.trim() && !groupExists) {
        handleCreateGroup();
      }
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={searchValue}
          onChange={handleSearchChange}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10 pr-4"
        />
      </div>

      {isOpen && searchValue.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50">
          {/* Filtered Groups */}
          {filteredGroups.length > 0 && (
            <div className="border-b border-border">
              {filteredGroups.map((group) => (
                <button
                  key={group.name}
                  onClick={() => handleSelectGroup(group)}
                  className="w-full px-4 py-3 text-sm text-left hover:bg-secondary flex items-center justify-between transition-colors first:rounded-t-lg"
                >
                  <div className="flex flex-col gap-1 text-left">
                    <span className="font-medium">{group.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {group.participants.length}/{maxMembers} members
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Create New Group Option */}
          {!groupExists && searchValue.trim() && (
            <button
              onClick={handleCreateGroup}
              className="w-full px-4 py-2 text-sm text-left hover:bg-secondary flex items-center gap-2 transition-colors last:rounded-b-lg text-primary font-medium"
            >
              <Plus className="h-4 w-4" />
              Create &quot;{searchValue}&quot;
            </button>
          )}

          {/* No results message */}
          {filteredGroups.length === 0 && groupExists && (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              This group already exists
            </div>
          )}
        </div>
      )}
    </div>
  );
}
