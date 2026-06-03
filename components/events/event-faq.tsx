"use client"

import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import type {ReactNode} from "react"

const FAQS: Record<"en" | "id", {id: string; question: string; answer: ReactNode}[]> = {
  en: [
    {
      id: "registration",
      question: "How do I register for the event?",
      answer:
        "Create an account or sign in with your email address. You'll receive a magic link to verify your account. Once signed in, select your category, group, and jersey size, then complete your rider profile and payment to confirm your spot.",
    },
    {
      id: "payment",
      question: "What payment methods are accepted?",
      answer: (
        <>
          We accept bank transfer via <strong>BNI Virtual Account</strong> and <strong>QRIS</strong> / credit card
          through our payment partner <strong>DOKU</strong>. Your registration is confirmed once the payment is
          verified.
        </>
      ),
    },
    {
      id: "change-payment",
      question: "Can I change my payment method?",
      answer: (
        <>
          Payment methods cannot be switched while an active payment is still pending or valid. You will need to wait
          for the current payment to expire. <strong>DOKU</strong> will send you an email notification once the invoice
          has expired, then you can select a different payment method.
        </>
      ),
    },
    {
      id: "refund",
      question: "Can I get a refund if I cancel?",
      answer:
        "Registration fees are non-refundable. However, you may transfer your spot to another rider up to 7 days before the event. Please contact us at support@barong.id to arrange a transfer.",
    },
    {
      id: "jersey",
      question: "When and where do I pick up my race pack?",
      answer: (
        <>
          Race pack collection (RPC) will be held <strong>2 days before the event</strong>. Please bring your
          confirmation email or QR code from your ticket to collect your jersey and other race materials.
        </>
      ),
    },
    {
      id: "group",
      question: "Can I register as a group?",
      answer:
        "Yes, all participants must register as part of a group with a minimum of 2 riders. The first rider to complete registration will receive a shareable link to invite their teammates. Teammates use that link to join the group and complete their own registration.",
    },
    {
      id: "bib",
      question: "How is my bib number assigned?",
      answer:
        "Bib numbers are assigned automatically when your registration is complete. You can find your bib number on your registration ticket, which is accessible from your profile page.",
    },
  ],
  id: [
    {
      id: "registration",
      question: "Bagaimana cara mendaftar untuk event ini?",
      answer:
        "Buat akun atau masuk menggunakan alamat email kamu. Kamu akan menerima magic link untuk verifikasi akun. Setelah masuk, pilih kategori, grup, dan ukuran jersey, lalu lengkapi profil rider dan selesaikan pembayaran untuk mengkonfirmasi pendaftaranmu.",
    },
    {
      id: "payment",
      question: "Metode pembayaran apa yang tersedia?",
      answer: (
        <>
          Kami menerima transfer bank melalui <strong>BNI Virtual Account</strong> dan <strong>QRIS / kartu
          kredit </strong> melalui mitra pembayaran kami <strong>DOKU</strong>. Pendaftaran dikonfirmasi setelah pembayaran
          terverifikasi.
        </>
      ),
    },
    {
      id: "change-payment",
      question: "Bisakah saya mengganti metode pembayaran?",
      answer: (
        <>
          Metode pembayaran tidak dapat diganti selama pembayaran aktif masih dalam status pending atau berlaku. Kamu
          perlu menunggu hingga pembayaran saat ini kedaluwarsa. <strong>DOKU</strong> akan mengirimkan notifikasi
          email setelah invoice kedaluwarsa, lalu kamu dapat memilih metode pembayaran lain.
        </>
      ),
    },
    {
      id: "refund",
      question: "Apakah saya bisa mendapat refund jika membatalkan?",
      answer:
        "Biaya pendaftaran tidak dapat dikembalikan. Namun, kamu dapat mengalihkan tempatmu kepada rider lain hingga 7 hari sebelum event berlangsung. ",
    },
    {
      id: "jersey",
      question: "Kapan dan di mana saya mengambil race pack?",
      answer: (
        <>
          Pengambilan race pack (RPC) akan dilakukan <strong>2 hari sebelum acara</strong>. Harap bawa email
          konfirmasi atau QR code dari tiket kamu untuk mengambil jersey dan perlengkapan lomba lainnya.
        </>
      ),
    },
    {
      id: "group",
      question: "Bisakah saya mendaftar sebagai grup?",
      answer:
        "Ya, semua peserta harus mendaftar sebagai bagian dari grup dengan minimal 2 rider. Rider pertama yang menyelesaikan pendaftaran akan mendapatkan tautan yang bisa dibagikan kepada rekan timnya. Rekan tim menggunakan tautan tersebut untuk bergabung ke grup dan menyelesaikan pendaftaran mereka sendiri.",
    },
    {
      id: "bib",
      question: "Bagaimana nomor bib saya ditentukan?",
      answer:
        "Nomor bib ditetapkan secara otomatis setelah pendaftaranmu selesai. Kamu dapat menemukan nomor bib di tiket pendaftaranmu, yang dapat diakses dari halaman profil.",
    },
  ],
}

export function EventFaq() {
  return (
    <div className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-foreground/10 w-full">
      <Tabs defaultValue="id">
        <div className="px-5 pt-5 pb-2 flex items-start justify-between gap-4">
          <div>
            <h2 className="mt-1 text-base font-bold">Frequently Asked Questions</h2>
          </div>
          <TabsList className="shrink-0">
            <TabsTrigger value="en">EN</TabsTrigger>
            <TabsTrigger value="id">ID</TabsTrigger>
          </TabsList>
        </div>

        {(["en", "id"] as const).map((lang) => (
          <TabsContent key={lang} value={lang}>
            <Accordion className="px-5 pb-4">
              {FAQS[lang].map((faq) => (
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
