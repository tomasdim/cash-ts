import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { IconCart, IconGoogle, IconFacebook } from '../components/icons';

const loginPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status !== 'loading' && status === 'authenticated') {
    router.push('/');
  }

  return (
    <div className='background h-screen flex'>
      <div className='m-auto bg-gray-100 p-10 flex flex-col justify-evenly rounded-md'>
        <div
          className='bg-zinc-700 my-3 hover:bg-zinc-600 text-white cursor-pointer flex items-center p-3 justify-around shadow-lg'
          onClick={() => signIn('github')}
        >
          <IconCart className='h-7 w-7 text-white' aria-hidden='true' />
          <button className='px-3 font-bold'>Sign in with Github</button>
        </div>
        <div
          className='bg-white my-3 hover:bg-blue-50 text-zinc-600 cursor-pointer flex items-center p-3 justify-around shadow-lg'
          onClick={() => signIn('google')}
        >
          <IconGoogle className='h-7 w-7 text-white' aria-hidden='true' />
          <button className='px-3 font-bold'>Sign in with Google</button>
        </div>
        <div
          className='bg-blue-500 my-3 hover:bg-blue-400 text-white cursor-pointer flex items-center p-3 justify-around shadow-lg'
          onClick={() => signIn('facebook')}
        >
          <IconFacebook className='h-7 w-7 text-white' aria-hidden='true' />
          <button className='px-3 font-bold'>Sign in with Facebook</button>
        </div>
      </div>
    </div>
  );
};

export default loginPage;
