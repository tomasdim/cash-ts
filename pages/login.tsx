import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';

const loginPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status !== 'loading' && status === 'authenticated') {
    router.push('/');
  }

  return (
    <div onClick={() => signIn('github')}>
      <button>Sign in with Github</button>
    </div>
  );
};

export default loginPage;
