import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
const { jwt } = require("next-auth/jwt");

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {},
    //   async authorize(credentials): Promise<any> {
    //     return await signInWithEmailAndPassword(
    //       auth,
    //       (credentials as any).email || "",
    //       (credentials as any).password || ""
    //     )
    //       .then((userCredential) => {
    //         if (userCredential.user) {
    //           return userCredential.user;
    //         }
    //         return null;
    //       })
    //       .catch((error) => console.log(error))
    //       .catch((error) => {
    //         const errorCode = error.code;
    //         const errorMessage = error.message;
    //         console.log(error);
    //       });
    //   },
    // }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        account.userId
        token.accessToken = account.access_token;
        token.id = account.userId;
      }
      return jwt;
    },
    async session({ session, user, token, }) {
      return session;
    },
    
  },
//@ts-ignore
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  }),
};
export default NextAuth(authOptions);
