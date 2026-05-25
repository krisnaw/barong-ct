'use client'

import {CheckIcon, CopyIcon} from "lucide-react";
import {toast} from "sonner";
import * as React from "react";
import {useState} from "react";
import {Field, FieldLabel} from "@/components/ui/field";
import {InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput} from "@/components/ui/input-group";

export function InviteItem({eventId, categoryId, groupId, groupName}: { eventId: number, categoryId: number, groupId: number, groupName: string }) {
  const baseURL = `${process.env.NEXT_PUBLIC_BASE_URL}/event/${eventId}/register/group`
  const url = new URL(baseURL);
  url.searchParams.append('groupId', String(groupId));
  url.searchParams.append('category', String(categoryId));
  url.searchParams.append('group', groupName);

  const shareUrl = url.toString()

  const [copied, setCopied] = useState(false)
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  return (
    <>
      <Field>
        <FieldLabel htmlFor="invite-link">Share link below to invite</FieldLabel>
        <InputGroup className="bg-white">
          <InputGroupInput
            id="invite-link"
            defaultValue={shareUrl}
            readOnly
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="Copy link" onClick={handleCopyLink}>
              {copied ? <CheckIcon/> : <CopyIcon/>}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </>

  )
}