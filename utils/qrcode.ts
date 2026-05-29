// lib/qrcode.ts
import QRCode from "qrcode"

export async function generateQRCode(data: string): Promise<string> {
  return await QRCode.toDataURL(data, {
    width: 300,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  })
}

export function formatQRData({registrationId,}: { registrationId: string
}) {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/participant/${registrationId}`
  // e.g. https://yourapp.com/admin/participant/abc123
}