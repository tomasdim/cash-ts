import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import { Operation } from '../utils/types';

const Home: NextPage = (props) => {
  const router = useRouter();
  if (props.operations.length === 0)
    return <div>No existen operaciones en la base de datos</div>;
  return (
    <div>
      {props.operations.map((operation) => (
        <div key={operation._id} className='text-blue-500'>
          {operation.name}
          <button onClick={() => router.push(`/operations/${operation._id}`)}>
            View More
          </button>
        </div>
      ))}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx: object) => {
  const res = await fetch('http://localhost:3000/api/operations');
  const operations = await res.json();
  return {
    props: {
      operations: operations,
    },
  };
};

export default Home;
