import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import type { User } from "next-auth";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";

function getGoogleCredentials() {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecrete = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientID || !clientSecrete)
    throw new Error("missing google id, or secret");
  return {
    clientID,
    clientSecrete,
  };
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientID,
      clientSecret: getGoogleCredentials().clientSecrete,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = ((await db.get(`user:${token.id}`)) as User) || null;
      if (!dbUser && user) {
        token.id = user.id; // Set the token ID to the user ID if a new user logs in
        return token;
      }

      // If the user already exists in Redis, return the existing token data
      return {
        id: dbUser?.id,
        name: dbUser?.name,
        email: dbUser?.email,
        picture: dbUser?.image,
      };
    },

    // This is the completed session callback
    async session({ session, token }) {
      if (token) {
        // Add the user ID from the token to the session user object
        session.user.id = token.id as string;
        // Optionally include other token data (like email or name) in the session if needed
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session; // Always return the modified session object
    },
    redirect({ url, baseUrl }) {
      return "/dashboard";
    },
  },
};
