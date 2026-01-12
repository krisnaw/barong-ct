import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {db} from "@/db/db";
import {magicLink} from "better-auth/plugins";


export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }, ctx) => {
        console.log(email, token, url)
        console.log(ctx)
      }
    })
  ]
});