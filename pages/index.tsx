import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Operation } from '../utils/types';

const Home: NextPage = (props) => {
  return (
    <div>
      {props.operations.map((operation) => (
        <div className='text-blue-500'>{operation.name}</div>
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
