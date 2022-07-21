import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import { Operation } from '../utils/types';
import { getSession, signOut } from 'next-auth/react';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import Navbar from '../components/Navbar';

const Home: NextPage = (props) => {
  const router = useRouter();
  const exp = props.expenses;
  const inc = props.income;
  const sumExp = exp.reduce((accumulator, object) => {
    return accumulator + object.amount;
  }, 0);
  const sumInc = inc.reduce((accumulator, object) => {
    return accumulator + object.amount;
  }, 0);
  if (props.operations.length === 0)
    return (
      <div>
        <Navbar
          username={props.session.user.name}
          img={props.session.user.image}
        />
        <div className='m-auto'>No tienes operaciones</div>
        <button onClick={() => router.push(`/operations/new`)}>
          Crear nueva Operacion
        </button>
      </div>
    );
  return (
    <div>
      <Navbar
        username={props.session.user.name}
        img={props.session.user.image}
      />
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
          <button onClick={() => router.push(`/operations/new`)}>
            Nueva operacion
          </button>
          <h1>Expenses:</h1>
          {sumExp}
          <h1>Income:</h1>
          {sumInc}
          <h1>Balance:</h1>
          {sumInc - sumExp}
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
    `http://localhost:3000/api/operations?limit=10&author=${session.user.name}`
  );
  const resExp = await fetch(
    `http://localhost:3000/api/operations/expense/${session.user.name}`
  );
  const resInc = await fetch(
    `http://localhost:3000/api/operations/income/${session.user.name}`
  );
  const expenses = await resExp.json();
  const income = await resInc.json();
  const operations = await res.json();
  console.log(expenses);

  return {
    props: {
      operations: operations,
      session: session,
      expenses: expenses,
      income: income,
    },
  };
};

export default Home;
