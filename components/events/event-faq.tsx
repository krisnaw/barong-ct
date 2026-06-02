import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion"

const FAQS = [
  {
    id: "registration",
    question: "How do I register for the event?",
    answer:
      "Create an account or sign in with your email address. You'll receive a magic link to verify your account. Once signed in, select your category, group, and jersey size, then complete your rider profile and payment to confirm your spot.",
  },
  {
    id: "payment",
    question: "What payment methods are accepted?",
    answer:
      "We accept bank transfer via BNI Virtual Account and QRIS / credit card through our payment partner DOKU. Your registration is confirmed once the payment is verified.",
  },
  {
    id: "refund",
    question: "Can I get a refund if I cancel?",
    answer:
      "Registration fees are non-refundable. However, you may transfer your spot to another rider up to 7 days before the event. Please contact us at support@barong.id to arrange a transfer.",
  },
  {
    id: "jersey",
    question: "When will I receive my jersey?",
    answer:
      "Jerseys are distributed at the event registration desk on the morning of the event. Please bring your confirmation email or QR code from your ticket.",
  },
  {
    id: "group",
    question: "Can I register as a group?",
    answer:
      "Yes — select or create a group during the registration flow. All group members must register individually but can join the same group name. Group rides have a minimum of 2 riders and a maximum defined per event.",
  },
  {
    id: "cutoff",
    question: "Is there a registration deadline?",
    answer:
      "Registration closes 3 days before the event date, or when the category reaches maximum capacity — whichever comes first. We recommend registering early to secure your preferred category.",
  },
  {
    id: "bib",
    question: "How is my bib number assigned?",
    answer:
      "Bib numbers are assigned automatically when your registration is complete. You can find your bib number on your registration ticket, which is accessible from your profile page.",
  },
]

export function EventFaq() {
  return (
    <div className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-foreground/10 w-full">
      <div className="px-5 pt-5 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">FAQ</p>
        <h2 className="mt-1 text-base font-bold">Frequently Asked Questions</h2>
      </div>

      <Accordion className="px-5 pb-4">
        {FAQS.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-sm font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
