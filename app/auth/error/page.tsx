import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Card, CardContent} from "@/components/ui/card";

export default async function callbackPage() {
  return (

    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardContent>
            <h2 className="text-lg font-medium">This sign-in link has expired or has already been used.</h2>
            <Button asChild={true}>
              <Link href="/auth/signup">
                Get a new link
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>

  )
}