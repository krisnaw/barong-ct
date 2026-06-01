import {type Step} from "@/components/ui/step-wizard";

export function getRegistrationSteps(current: "group" | "profile" | "payment"): Step[] {
  const order = ["group", "profile", "payment"] as const

  return [
    { id: "group",   label: "Group & Jersey" },
    { id: "profile", label: "Profile"        },
    { id: "payment", label: "Payment"        },
  ].map((step) => {
    const stepIndex = order.indexOf(step.id as typeof order[number])
    const currentIndex = order.indexOf(current)
    return {
      ...step,
      status: stepIndex < currentIndex ? "complete"
            : stepIndex === currentIndex ? "current"
            : "upcoming",
    } satisfies Step
  })
}