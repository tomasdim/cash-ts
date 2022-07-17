import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import { Operation } from '../utils/types';
import { getSession, signOut } from 'next-auth/react';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const Home: NextPage = (props) => {
  const router = useRouter();
  if (props.operations.length === 0)
    return <div>No existen operaciones en la base de datos</div>;
  return (
    <div>
      {props.session ? (
        <>
          {props.operations.map((operation) => (
            <div key={operation._id} className='text-blue-500'>
              {operation.name}
              <button
                className='p-3'
                onClick={() => router.push(`/operations/${operation._id}`)}
              >
                View More
              </button>
              <button
                className='p-3'
                onClick={() => router.push(`/operations/${operation._id}/edit`)}
              >
                Edit
              </button>
            </div>
          ))}
          <h1>{props.session.user.name}</h1>
          <img src={props.session.user.image}></img>
          <button onClick={() => signOut()}>Logout</button>
        </>
      ) : (
        <>
          <h1>You need to login!</h1>
        </>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: object
) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  // const session = await getSession(context);
  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  const res = await fetch(
    `http://localhost:3000/api/operations/author/${session.user.name}`
  );
  const operations = await res.json();
  return {
    props: {
      operations: operations,
      session: session,
    },
  };
};

export default Home;
