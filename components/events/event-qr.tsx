import {ParticipantType} from "@/db/schema";
import {formatQRData, generateQRCode} from "@/utils/qrcode";
import Image from "next/image";
import {Item, ItemContent, ItemDescription, ItemHeader, ItemTitle} from "@/components/ui/item";

export async function EventQr({participant} : { participant : ParticipantType}) {
  const qrData = formatQRData({ registrationId: participant.id as unknown as string })
  const qrCodeUrl = await generateQRCode(qrData)

  return (
    <Item>
      <ItemContent className="flex justify-center">
        <Image src={qrCodeUrl} alt="Race kit QR code" width={300} height={300} />
      </ItemContent>
      <ItemHeader className="flex flex-col text-center">
        <ItemTitle>Your participant QR code</ItemTitle>
        <ItemDescription className="line-clamp-none text-center">
          Show this at the race kit pickup booth. Our staff will scan it to verify your registration and hand over your kit
        </ItemDescription>
      </ItemHeader>
    </Item>
  )

}