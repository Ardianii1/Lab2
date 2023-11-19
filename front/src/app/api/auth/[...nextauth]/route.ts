import prismadb from "@/lib/prismadb";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from 'bcrypt'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  pages:{
    signIn:"/signin",
  },
  session: {
    strategy: 'jwt'
  },
  // adapter: PrismaAdapter(prismadb),
  providers: [
    CredentialsProvider({
      // name: '',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'hello@example.com'
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const user = await prismadb.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

      //   console.log(credentials.password)

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }
        

        return {
          id: user.id + '',
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  callbacks: {
    session: ({ session, token }) => {
      // console.log('Session Callback', { session, token })
      // console.log(session)
      
      return {
        ...session,
        user: {
          ...session.user,
         //  id: token.id,
          role: token.role,
        }
      }
    },
    jwt: ({ token, user }) => {
      // console.log('JWT Callback', { token, user })
      if (user) {
        const u = user as unknown as any
        return {
          ...token,
          id: u.id,
          role: u.role
        }
      }
      return token
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

