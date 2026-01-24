import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import User from '@/models/User';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        // Here you would normally fetch the user from your database
        const user = await User.findOne({ email });
        if (!user) {
          console.log('User not found');
          return null;
        }
        
      },
    }),
  ],
});
