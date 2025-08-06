import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "../../../util/mongodb";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      try {
        // Ensure session and user exist
        if (!session || !session.user || !session.user.email) {
          console.warn("Session callback: Invalid session structure");
          return session;
        }

        const { db } = await connectToDatabase();
        const admin = await db
          .collection("admins")
          .findOne({ user: session.user.email });
        
        session.admin = !!admin;
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        // Ensure session exists before setting admin property
        if (session) {
          session.admin = false;
        }
        return session || {};
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.admin = user.admin;
      }
      return token;
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
  
  session: {
    strategy: "jwt",
  },
});
