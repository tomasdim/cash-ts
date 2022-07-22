import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import Navbar from '../components/navbar/Navbar';
import Image from 'next/image';
import NoOperations from '../components/index/NoOperations';

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

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/operations/${id}`, {
        method: 'DELETE',
      });
      console.log('Operation has been deleted!');
      router.push('/');
    } catch (err) {
      console.log(err);
    }
  };

  if (props.operations.length === 0)
    return (
      <div>
        <Navbar
          username={props.session.user.name}
          img={props.session.user.image}
        />
        <NoOperations />
      </div>
    );
  return (
    <div>
      <Navbar
        username={props.session.user.name}
        img={props.session.user.image}
      />
      <div className='flex'>
        <h1 className='m-auto text-green-500'>Mis últimas 10 operaciones</h1>
      </div>
      <div className='grid grid-cols-7'>
        <div>Nombre</div>
        <div>Cantidad</div>
        <div>Fecha</div>
        <div>Tipo</div>
        <div>Categoría</div>
        <div>Editar</div>
        <div>Eliminar</div>
      </div>
      {props.session ? (
        <>
          <div className='grid grid-cols-7'>
            {props.operations.map((operation) => (
              <>
                <div key={operation._id} className='text-blue-500'>
                  {operation.name}
                </div>
                <div>{operation.amount}</div>
                <div>{operation.date.substring(0, 10)}</div>
                <div>{operation.type}</div>
                <div>{operation.category}</div>
                <button
                  className='p-3'
                  onClick={() => handleDelete(operation._id)}
                >
                  View More
                </button>
                <button
                  className='p-3'
                  onClick={() =>
                    router.push(`/operations/${operation._id}/edit`)
                  }
                >
                  Edit
                </button>
              </>
            ))}

            {/* <button
            className='bg-blue-500 p-3 mt-5 rounded-lg text-white hover:bg-blue-400'
            onClick={() => router.push(`/operations/new`)}
          >
            Create new operation
          </button>
          <h1>Expenses:</h1>
          {sumExp}
          <h1>Income:</h1>
          {sumInc}
          <h1>Balance:</h1>
          {sumInc - sumExp}
          <h1>{props.session.user.name}</h1>
          <img src={props.session.user.image}></img>
          <button onClick={() => signOut()}>Logout</button> */}
          </div>
        </>
      ) : (
        <>
          <h1>You need to login!</h1>
        </>
      )}
      <h1>Balance:</h1>
      {sumInc - sumExp}
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
