import {Button} from "@/components/ui/button";
import Link from "next/link";

export default async function callbackPage() {
  return (
    <div>

      Sorry something wrong,

      CLick here to login again

      <Button asChild={true}>
        <Link href="/auth/signup">
          Sign up
        </Link>
      </Button>

    </div>
  )
}