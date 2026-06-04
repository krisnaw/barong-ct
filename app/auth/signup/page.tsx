import {SignupForm} from "@/components/signup-form"
import {FieldDescription} from "@/components/ui/field";

export default async function SignupPage({
                                           searchParams,
                                         }: {
  searchParams: Promise<{ returnUrl?: string }>
}) {
  const { returnUrl } = await searchParams
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex flex-col items-center gap-2 font-medium">
            <img
              alt="Barong Cycling Logo"
              src="/barong-no-bg.svg"
              className="h-24"
            />
            <span className="sr-only">Barong Cycling.</span>
          </div>
          <h1 className="text-xl font-bold">Welcome to Barong Cycling</h1>
          <FieldDescription>
            Please fill with your email address to sign up or sign to you account. After that check your email.
          </FieldDescription>
        </div>
        <div className="mt-6">
          <SignupForm returnURL={returnUrl} />
        </div>
      </div>
    </div>
  )
}
