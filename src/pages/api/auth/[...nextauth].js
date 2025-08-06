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
  
  pages: {
    signIn: undefined, // Use default NextAuth sign-in page
    error: '/auth/error', // Custom error page (optional)
  },

  callbacks: {
    async session({ session, token }) {
      // Simple session callback - just add admin property
      if (session && session.user) {
        session.admin = false; // Default to false for regular users
      }
      return session;
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
  
  session: {
    strategy: "jwt",
  },
});
