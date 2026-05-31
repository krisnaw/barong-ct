import {ParticipantType} from "@/db/schema";
import {formatQRData, generateQRCode} from "@/utils/qrcode";
import Image from "next/image";
import {ScanLineIcon} from "lucide-react";

export async function EventQr({participant} : { participant : ParticipantType}) {
  const qrData = formatQRData({ registrationId: participant.id as unknown as string })
  const qrCodeUrl = await generateQRCode(qrData)

  return (
    <div className="flex flex-col items-center gap-4 px-6 py-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="flex size-8 items-center justify-center rounded-full bg-muted">
          <ScanLineIcon className="size-4 text-muted-foreground" />
        </div>
        <p className="text-sm font-semibold">Participant QR Code</p>
        <p className="text-xs text-muted-foreground">
          Show this at the race kit pickup booth
        </p>
      </div>
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <Image src={qrCodeUrl} alt="Race kit QR code" width={200} height={200} />
      </div>
    </div>
  )
}
