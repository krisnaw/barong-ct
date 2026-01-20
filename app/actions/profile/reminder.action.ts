'use server'

import {Resend} from "resend";
import ProfileReminder from "@/react-email-starter/emails/profile-reminder-email";
import EventReminder from "@/react-email-starter/emails/event-reminder-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendProfileReminder(prevState: void | null, formData: FormData) {
  const email = formData.get('email') as string;
  const url = "https://www.barongmelali.com/profile"
  await resend.emails.send({
    from: 'Barong Cycling Team <info@barongmelali.com>',
    to: [email],
    subject: 'Complete your profile to join this event',
    react: ProfileReminder({
      email, url
    })
  })
}

export async function sendEventReminder(prevState: void | null, formData: FormData) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const url = "https://www.barongmelali.com/event/1"
  await resend.emails.send({
    from: 'Barong Cycling Team <info@barongmelali.com>',
    to: [email],
    subject: 'Reminder to join the event',
    react: EventReminder({
      name, url
    })
  })
}