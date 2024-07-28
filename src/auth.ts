import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import connectDB from "./lib/db";
import { User } from "./models/User";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) {
          throw new CredentialsSignin(`please provide both email and password`);
        }
        await connectDB();

        const user = await User.findOne({ email }).select("+password +role");

        if (!user) {
          throw new Error("Invalid email and password");
        }

        if (!user.password) {
          throw new Error("Invalid email and password");
        }

        const isMatched = await compare(password, user.password);

        if (!isMatched) {
          throw new Error("Password didn't matched");
        }

        const userData = {
          userName: user.fulname,
          email: user.email,
          role: user.role,
          id: user._id,
        };
        return userData;
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      // Add user ID and role to the session object
      if (token?.sub && token?.role) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },

    async jwt({ token, user }) {
      // Add user role to the token object
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    signIn: async ({ user, account }) => {
      try {
        // Connect to the database
        await connectDB();

        // Extract user details from the account object
        const { email, name, image, id } = user;
        const provider = account?.provider;

        // Check for an existing user with the same email and provider
        const alreadyUser = await User.findOne({ email, authProvider: provider });

        // Handle Google provider
        if (provider === "google") {
          console.log("Signing in with Google");

          if (!alreadyUser) {
            // Create a new user for Google sign-in
            await User.create({ email, fulname: name, image, authProviderId: id, authProvider: provider });
            console.log("New user created for Google");
          } else {
            console.log("User already exists for Google");
          }
          return true;
        }

        // Handle GitHub provider
        if (provider === "github") {
          console.log("Signing in with GitHub");

          if (!alreadyUser) {
            // Create a new user for GitHub sign-in
            await User.create({ email, fulname: name, image, authProviderId: id, authProvider: provider });
            console.log("New user created for GitHub");
          } else {
            console.log("User already exists for GitHub");
          }
          return true;
        }

        // Handle Credentials provider
        if (provider === "credentials") {
          console.log("Signing in with credentials");
          return true;
        }

        // Handle unsupported providers
        console.log("Unsupported provider");
        return false;
      } catch (error) {
        console.error("Error during sign-in:", error);
        throw new Error("Error while processing sign-in");
      }
    },
  },

  pages: {
    signIn: "/login",
  },
});
