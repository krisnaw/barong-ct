import {SignupForm} from "@/components/signup-form"
import {headers} from "next/headers";

export default async function SignupPage() {
  const headersList = await headers();
  const referrer = headersList.get('referer') ?? undefined
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm refURL={referrer} />
      </div>
    </div>
  )
}
