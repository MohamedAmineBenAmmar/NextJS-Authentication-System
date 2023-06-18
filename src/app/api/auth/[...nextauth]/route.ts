// Dynamic route handler for the nextauth
// /api/auth/* ===> every route will be handled here
// /api/auth/signin
// /api/auth/signout
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const res = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });

        const user = await res.json();

        // Note: In real world scenarios we should send POST request to backend api and if everything is ok
        // we get the user object with the basic info
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user; // returning the user into the session of the nextauth
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null; // Returning null to the session of the nextauth

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ], // represents a specific way of authentication
  // session: {
  // The session will be tuned into a jwt token and stored inside an HTTP cookie
  // We can specify also the max age of the session
  // The default stategy is jwt
  // }
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user }; // Creating the jwt token that combines token + User
    },

    async session({ session, token }) {
      session.user = token as any; // Session the user to the newly updated token
      return session;
    },
  },
});

export { handler as GET, handler as POST };
// Every POST and GET request to this api route will be handled by the nextauth
// We used this so can have thge nextauth api inside the app directory
