import {CheckIcon} from "lucide-react";
import {cn} from "@/lib/utils";

export type Step = {
  id: string
  label: string
  status: "complete" | "current" | "upcoming"
}

function StepIndicator({ step, index }: { step: Step; index: number }) {
  return (
    <div className={cn(
      "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200",
      step.status === "complete" && "bg-primary text-primary-foreground",
      step.status === "current"  && "bg-primary/10 text-primary ring-2 ring-primary ring-offset-2 ring-offset-background",
      step.status === "upcoming" && "border-2 border-border bg-background text-muted-foreground",
    )}>
      {step.status === "complete" ? (
        <CheckIcon className="size-4" />
      ) : (
        <span>{String(index + 1).padStart(2, "0")}</span>
      )}
    </div>
  )
}

export function StepWizard({ steps }: { steps: Step[] }) {
  const currentIndex = steps.findIndex(s => s.status === "current")
  const currentStep = steps[currentIndex]

  return (
    <nav aria-label="Registration progress">

      {/* Mobile — progress bar + current step label */}
      <div className="sm:hidden space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{currentStep?.label ?? steps[steps.length - 1]?.label}</span>
          <span>Step {currentIndex + 1} of {steps.length}</span>
        </div>
        <div className="flex gap-1">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                step.status === "complete" && "bg-primary",
                step.status === "current"  && "bg-primary/50",
                step.status === "upcoming" && "bg-border",
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop — horizontal circles + connector lines */}
      <ol className="hidden sm:flex items-start">
        {steps.map((step, i) => (
          <li key={step.id} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
            <div className="flex flex-col items-center gap-2">
              <StepIndicator step={step} index={i} />
              <span className={cn(
                "text-xs font-medium whitespace-nowrap transition-colors",
                step.status === "current"  && "text-primary font-semibold",
                step.status === "complete" && "text-muted-foreground",
                step.status === "upcoming" && "text-muted-foreground",
              )}>
                {step.label}
              </span>
            </div>

            {/* Connector line — fills with primary when step is complete */}
            {i < steps.length - 1 && (
              <div className={cn(
                "mx-3 mb-6 h-0.5 flex-1 rounded-full transition-colors duration-300",
                step.status === "complete" ? "bg-primary" : "bg-border",
              )} />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Preview with mock data
export function StepWizardPreview() {
  const steps: Step[] = [
    { id: "group",   label: "Group & Jersey", status: "complete" },
    { id: "profile", label: "Profile",        status: "current"  },
    { id: "payment", label: "Payment",        status: "upcoming" },
  ]
  return <StepWizard steps={steps} />
}