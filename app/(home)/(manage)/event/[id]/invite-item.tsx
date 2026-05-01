'use client'

import {CheckIcon, CopyIcon} from "lucide-react";
import {toast} from "sonner";
import * as React from "react";
import {useState} from "react";
import {GroupWithParticipant} from "@/db/schema";
import {Field, FieldLabel} from "@/components/ui/field";
import {InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput} from "@/components/ui/input-group";

export function InviteItem({ eventId, group }: { eventId: number, group: GroupWithParticipant }) {
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/event/${eventId}/order?group=${group.id}`
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
        <InputGroup        className="bg-white">
          <InputGroupInput
            id="invite-link"
            defaultValue={shareUrl}
            readOnly
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="Copy link" onClick={handleCopyLink}>
              {copied ? <CheckIcon /> : <CopyIcon />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </>

  )
}