import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import Navbar from '../components/navbar/Navbar';

import NoOperations from '../components/index/NoOperations';
import MyModal from '../components/modal/Modal';

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
      <div className='flex justify-center'>
        <h1 className='text-green-500 flex justify-center'>
          Mis últimas 10 operaciones
        </h1>
      </div>
      <div className='overflow-x-auto'>
        <div className='grid grid-cols-7'>
          <div className='flex justify-center'>Nombre</div>
          <div className='flex justify-center'>Cantidad</div>
          <div className='flex justify-center'>Fecha</div>
          <div className='flex justify-center'>Tipo</div>
          <div className='flex justify-center'>Categoría</div>
          <div className='flex justify-center'>Eliminar</div>
          <div className='flex justify-center'>Editar</div>
        </div>
      </div>
      {props.session ? (
        <>
          <div className='grid grid-cols-7'>
            {props.operations.map((operation) => (
              <>
                <div
                  key={operation._id}
                  className='flex justify-center text-blue-500'
                >
                  {operation.name}
                </div>
                <div className='flex justify-center text-blue-500'>
                  {operation.amount}
                </div>
                <div className='flex justify-center text-blue-500'>
                  {operation.date.substring(0, 10)}
                </div>
                <div className='flex justify-center text-blue-500'>
                  {operation.type}
                </div>
                <div className='flex justify-center text-blue-500'>
                  {operation.category}
                </div>
                <div className='flex justify-center'>
                  <MyModal function={() => handleDelete(operation._id)} />
                </div>
                <div className='flex justify-center py-1'>
                  <button
                    className='inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                    onClick={() =>
                      router.push(`/operations/${operation._id}/edit`)
                    }
                  >
                    Edit
                  </button>
                </div>
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
            <div className='flex w-full'>
              <div className='m-auto'>
                <button
                  className='bg-blue-500 p-3 mt-5 rounded-lg text-white hover:bg-blue-400'
                  onClick={() => router.push(`/operations/new`)}
                >
                  Create new operation
                </button>
                <h1>Balance:</h1>
                {sumInc - sumExp}
              </div>
            </div>
          </div>
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
