import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {db} from "@/db/db";
import {admin, magicLink} from "better-auth/plugins";

import {Resend} from "resend";
import {nextCookies} from "better-auth/next-js";
import SignupLink from "@/react-email-starter/emails/auth/signup-link";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin(),
    magicLink({
      expiresIn: 900,
      sendMagicLink: async ({ email, token, url }, ctx) => {
        try {
          await resend.emails.send({
            from: 'Barong Cycling Team <info@barongmelali.com>',
            to: [email],
            subject: 'Sign in to your account',
            react: SignupLink({ email, url })
          })
        } catch (e) {
          console.log(e)
        }

      }
    }),
    nextCookies(),
  ]
});