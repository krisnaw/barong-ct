import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {db} from "@/db/db";
import {magicLink} from "better-auth/plugins";

import {Resend} from "resend";

import NotionMagicLink from "@/react-email-starter/emails/notion-magic-link";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }, ctx) => {

        console.log('token', token);
        console.log('url', url);


        try {
          const data = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: ['krisna.w2010@me.com'],
            subject: 'Hello world',
            react: NotionMagicLink({ url, loginCode: '123'})
          })

          console.log(data)
        } catch (e) {
          console.log(e)
        }

      }
    })
  ]
});