import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';

import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../utils/mongodb';

const {
  GITHUB_CLIENT_ID,
  GITHUB_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
} = process.env;
export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GithubProvider({
      clientId: GITHUB_CLIENT_ID!,
      clientSecret: GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: FACEBOOK_CLIENT_ID!,
      clientSecret: FACEBOOK_CLIENT_SECRET!,
    }),
  ],
};

export default NextAuth(authOptions);
