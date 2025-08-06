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
    
    async redirect({ url, baseUrl }) {
      // Ensure redirect goes to home page after sign-in, not admin pages
      if (url.includes('/admin') || url.includes('admin-login')) {
        return baseUrl; // Redirect to home page instead
      }
      // If url is relative, allow it
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // If url is on same origin, allow it
      if (new URL(url).origin === baseUrl) return url;
      // Otherwise redirect to home
      return baseUrl;
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
  
  session: {
    strategy: "jwt",
  },
});
