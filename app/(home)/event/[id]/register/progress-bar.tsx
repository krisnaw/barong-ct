import {CheckIcon} from "lucide-react";

const steps = [
  { id: '01', name: 'Group and Jersey', href: '#', status: 'complete' },
  { id: '02', name: 'Profile', href: '#', status: 'current' },
  { id: '03', name: 'Payment', href: '#', status: 'upcoming' },
]

export default function ProgressBar() {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="divide-y divide-gray-300 rounded-xl border border-gray-300 md:flex md:divide-y-0">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative md:flex md:flex-1">
            {step.status === 'complete' ? (
              <div className="group flex w-full items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary group-hover:bg-orange-800">
                    <CheckIcon aria-hidden="true" className="size-6 text-white" />
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-900">{step.name}</span>
                </span>
              </div>
            ) : step.status === 'current' ? (
              <div  aria-current="step" className="flex items-center px-6 py-4 text-sm font-medium">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-primary">
                  <span className="text-primary">{step.id}</span>
                </span>
                <span className="ml-4 text-sm font-medium text-primary">{step.name}</span>
              </div>
            ) : (
              <div  className="group flex items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                    <span className="text-gray-500 group-hover:text-gray-900">{step.id}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">{step.name}</span>
                </span>
              </div>
            )}

            {stepIdx !== steps.length - 1 ? (
              <>
                {/* Arrow separator for lg screens and up */}
                <div aria-hidden="true" className="absolute top-0 right-0 hidden h-full w-5 md:block">
                  <svg fill="none" viewBox="0 0 22 80" preserveAspectRatio="none" className="size-full text-gray-300">
                    <path
                      d="M0 -2L20 40L0 82"
                      stroke="currentcolor"
                      vectorEffect="non-scaling-stroke"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}
