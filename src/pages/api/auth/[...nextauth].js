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
    signIn: '/auth/signin', // Custom beautiful sign-in page
    error: '/auth/error', // Custom error page (optional)
  },

  // No callbacks needed - keep client sessions simple
  
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
  
  session: {
    strategy: "jwt",
  },
});
