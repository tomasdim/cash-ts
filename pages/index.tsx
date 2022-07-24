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
      <div className='overflow-auto rounded-lg shadow px-3'>
        <table className='w-full'>
          <thead className='border-b-2 border-gray-200'>
            <tr className='bg-white'>
              <th className='p-3 text-sm font-semibold tracking-wide text-left'>
                Nombre
              </th>
              <th className='w-28 p-3 text-sm font-semibold tracking-wide text-left'>
                Cantidad ($)
              </th>
              <th className='w-32 p-3 text-sm font-semibold tracking-wide text-left'>
                Fecha
              </th>
              <th className='w-20 p-3 text-sm font-semibold tracking-wide text-left'>
                Tipo
              </th>
              <th className='w-40 p-3 text-sm font-semibold tracking-wide text-left'>
                Categoría
              </th>
              <th className='w-20 p-3 text-sm font-semibold tracking-wide text-left'>
                Eliminar
              </th>
              <th className='w-20 p-3 text-sm font-semibold tracking-wide text-left'>
                Editar
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {props.operations.map((operation) => (
              <tr className='bg-white' key={operation._id}>
                <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
                  {operation.name}
                </td>
                <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
                  {operation.amount}
                </td>
                <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
                  {operation.date.substring(0, 10)}
                </td>
                <td className='p-3 text-sm whitespace-nowrap'>
                  <span
                    className={`p-1.5 text-xs font-medium uppercase tracking-wider ${
                      operation.type === 'income'
                        ? 'text-green-800 bg-green-300 rounded-lg'
                        : 'text-red-500 bg-red-300 rounded-lg'
                    }`}
                  >
                    {operation.type}
                  </span>
                </td>
                <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
                  {operation.category}
                </td>
                <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
                  <MyModal function={() => handleDelete(operation._id)} />
                </td>
                <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
                  <button
                    className='inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                    onClick={() =>
                      router.push(`/operations/${operation._id}/edit`)
                    }
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='mt-10 flex w-full items-center justify-around'>
        <div className=' flex items-center m-auto'>
          <button
            className='bg-blue-500 p-3  rounded-lg text-white hover:bg-blue-400'
            onClick={() => router.push(`/operations/new`)}
          >
            Create new operation
          </button>
          <div className='flex'>
            <h1 className='text-lg p-3 bg-orange-300 rounded-lg'>
              Balance: {sumInc - sumExp}
            </h1>
          </div>
        </div>
      </div>
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
