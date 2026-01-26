'use client'

import {Button} from "@/components/ui/button";
import {Download} from "lucide-react";
import {getParticipantByEvent} from "@/db/query/participant-query";
import * as XLSX from 'xlsx';

interface ButtonDownloadParticipantProps {
  eventId: number;
  eventName?: string;
}

export function ButtonDownloadParticipant({eventId, eventName}: ButtonDownloadParticipantProps) {
  const handleDownload = async () => {
    try {
      const participants = await getParticipantByEvent(eventId, true);
      
      if (!participants || participants.length === 0) {
        alert('No participants found for this event');
        return;
      }

      const excelData = participants.map(p => ({
        Name: p.user.name || '',
        Email: p.user.email,
        Phone: p.userDetail?.phoneNumber || ''
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Participants');
      
      const fileName = `${eventName || `event-${eventId}`}-participants.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Error downloading participants:', error);
      alert('Failed to download participants');
    }
  };

  return (
    <Button onClick={handleDownload} variant="outline" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Download
    </Button>
  );
}