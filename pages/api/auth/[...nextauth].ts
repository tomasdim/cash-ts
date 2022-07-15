import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

const { GITHUB_CLIENT_ID, GITHUB_SECRET } = process.env;

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: GITHUB_CLIENT_ID!,
      clientSecret: GITHUB_SECRET!,
    }),
  ],
});
