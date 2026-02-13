'use client'

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {CheckIcon, CopyIcon, ShareIcon} from "lucide-react";
import {ButtonGroup} from "@/components/ui/button-group";
import {toast} from "sonner";
import {useState} from "react";
import {GroupWithParticipant} from "@/db/schema";

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

    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="px-4 py-5 sm:px-6">

        <div className="flex">
          <div className="mr-4 shrink-0 ">
            <div className="size-8 [&_svg:not([class*='size-'])]:size-4 border rounded-sm bg-muted flex items-center justify-center">
              <ShareIcon />
            </div>

          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Share and invite </h3>
          </div>
        </div>

      </div>
      <div className="px-4 py-5 sm:p-6">
        <ButtonGroup className="w-full">
          <Input defaultValue={shareUrl} disabled={true} />
          <Button variant="outline" aria-label="Search" onClick={handleCopyLink}>
            {copied ? <CheckIcon /> :        <CopyIcon />}
          </Button>
        </ButtonGroup>
      </div>
      <div className="px-4 py-4 sm:px-6">
        {/* Content goes here */}
        {/* We use less vertical padding on card footers at all sizes than on headers or body sections */}
      </div>
    </div>

  )
}