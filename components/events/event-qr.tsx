import {ParticipantType} from "@/db/schema";
import {formatQRData, generateQRCode} from "@/utils/qrcode";
import Image from "next/image";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export async function EventQr({participant} : { participant : ParticipantType}) {
  const qrData = formatQRData({ registrationId: participant.id as unknown as string })
  const qrCodeUrl = await generateQRCode(qrData)

  return (
    <Card>
      <CardContent className="flex justify-center pt-6">
        <div className="rounded-xl border bg-white p-4">
          <Image src={qrCodeUrl} alt="Race kit QR code" width={300} height={300} />
        </div>
      </CardContent>
      <CardHeader className="text-center">
        <CardTitle>Your participant QR code</CardTitle>
        <CardDescription>
          Show this code at the race kit pickup booth. <br/> Our staff will scan it to verify your registration and hand over your kit
        </CardDescription>
      </CardHeader>

    </Card>
  )

}