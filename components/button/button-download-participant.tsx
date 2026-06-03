'use client'

import {Button} from "@/components/ui/button";
import {Download} from "lucide-react";
import {getParticipantsForDownload} from "@/db/query/participant-query";
import {useState} from "react";

interface ButtonDownloadParticipantProps {
  eventId: number;
  eventName?: string;
}

function toCSV(rows: string[][]): string {
  return rows
    .map(row => row.map(cell => `"${(cell ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n")
}

export function ButtonDownloadParticipant({eventId, eventName}: ButtonDownloadParticipantProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const participants = await getParticipantsForDownload(eventId)

      if (!participants || participants.length === 0) {
        alert('No participants found for this event')
        return
      }

      const headers = ["Bib", "Name", "Email", "Phone", "Category", "Group", "Jersey Size"]
      const rows = participants.map(p => [
        p.bibNumber ?? "",
        p.userName ?? "",
        p.userEmail ?? "",
        p.phone ?? "",
        p.categoryName ?? "",
        p.groupName ?? "",
        p.jerseySize ?? "",
      ])

      const csv = toCSV([headers, ...rows])
      const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"})
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${eventName || `event-${eventId}`}-participants.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading participants:', error)
      alert('Failed to download participants')
    } finally {
      setLoading(false)
    }
  };

  return (
    <Button onClick={handleDownload} variant="outline" disabled={loading}>
      <Download className="h-4 w-4 mr-2" />
      {loading ? "Downloading..." : "Download"}
    </Button>
  );
}
