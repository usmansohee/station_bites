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
        const { db } = await connectToDatabase();
        const admin = await db
          .collection("admins")
          .findOne({ user: session.user.email });
        
        session.admin = !!admin;
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        session.admin = false;
        return session;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.admin = user.admin;
      }
      return token;
    },
  },
  
  pages: {
    signIn: '/admin-login',
  },
  
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
  
  session: {
    strategy: "jwt",
  },
});
