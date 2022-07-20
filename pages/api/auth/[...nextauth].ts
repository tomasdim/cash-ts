import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';

import GithubProvider from 'next-auth/providers/github';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../utils/mongodb';

const { GITHUB_CLIENT_ID, GITHUB_SECRET } = process.env;
export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GithubProvider({
      clientId: GITHUB_CLIENT_ID!,
      clientSecret: GITHUB_SECRET!,
    }),
  ],
};

export default NextAuth(authOptions);
