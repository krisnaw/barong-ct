'use client'
import {Button} from "@/components/ui/button";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export function StepProfile() {
  const pathname = usePathname()
  const searchParams = useSearchParams().toString()
  const newPath = pathname.replace(/\/[^/]+$/, `/payment`);
  const router = useRouter();

  function onClick() {
    router.push(`${newPath}?${searchParams}`);
  }
  return (
    <div>
      <Button onClick={onClick}>Continue</Button>
    </div>
  )
}