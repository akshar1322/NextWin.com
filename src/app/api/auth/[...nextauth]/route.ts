import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { getClient } from "@/lib/dbConnect"; // ✅ use the fixed helper
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import User from "@/models/User";

const handler = NextAuth({
  adapter: MongoDBAdapter(getClient), // ✅ works perfectly now

  session: {
    strategy: "jwt", // lightweight, fast sessions
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // connect to DB
        await dbConnect();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password");
        }

        // find user
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with this email");
        }

        // verify password
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        // return user info for JWT/session
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login", // ✅ custom login page (optional)
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
