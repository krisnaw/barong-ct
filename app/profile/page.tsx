import {auth} from "@/lib/auth";
import {headers} from "next/headers";

export default async function ProfilePage() {

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  })


  return (
    <div>
      User should be redirect here after clicking the magic link
    </div>
  )
}