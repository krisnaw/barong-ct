import Link from "next/link";
import {ArrowLeft} from "lucide-react";

import {buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";

type BackButtonProps = {
  href: string;
  children?: React.ReactNode;
  className?: string;
};

export function BackButton({
  href,
  children = "Back",
  className,
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({variant: "outline", size: "sm"}),
        "active:scale-[0.96] transition-transform duration-150 ease-out",
        className
      )}
    >
      <ArrowLeft aria-hidden="true" className="size-4"/>
      {children}
    </Link>
  );
}
