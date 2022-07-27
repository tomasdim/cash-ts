import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import Navbar from '../components/navbar/Navbar';
import { ChangeEvent, useState } from 'react';
import NoOperations from '../components/index/NoOperations';
import MyModal from '../components/modal/Modal';
import { Props } from '../utils/types';

const Categories: NextPage<Props> = (props: Props) => {
  const [newOperation, setNewOperation] = useState(props.operations);
  const router = useRouter();
  const exp = props.expenses;
  const inc = props.income;
  const cat = props.operations.map((cat) => cat.category);
  const sumExp = exp.reduce((accumulator, object) => {
    return accumulator + object.amount;
  }, 0);
  const sumInc = inc.reduce((accumulator, object) => {
    return accumulator + object.amount;
  }, 0);

  const removeDuplicates = (data: string[]) => {
    return data.filter((value, index) => data.indexOf(value) === index);
  };

  const filteredCategories = removeDuplicates(cat as string[]);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`https://cash-ts.vercel.app/api/operations/${id}`, {
        method: 'DELETE',
      });
      router.push('/categories');
    } catch (err) {
      console.log(err);
    }
  };

  const showCategories = () => {
    console.log(filteredCategories);
  };

  const handleChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const filteredOperations = await fetch(
      `https://cash-ts.vercel.app/api/operations?category=${e.target.value}&author=${props.session.user.name}`,
      { method: 'GET' }
    );
    const resFiltered = await filteredOperations.json();
    if (resFiltered.length === 0) {
      setNewOperation(props.operations);
    } else setNewOperation(resFiltered);
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

      <div className='flex justify-center my-3'>
        {/* <button onClick={showCategories}>Mostrar categorias</button>
        <h1 className='text-green-500 flex justify-center'>
          Mis últimas 10 operaciones
        </h1> */}
        <h1 className='text-green-800 underline flex justify-center text-lg font-semibold'>
          Filter by category:
        </h1>
        <select className='border border-green-800 m-1' onChange={handleChange}>
          <option>All</option>
          {filteredCategories.map((cat: string) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className='overflow-auto rounded-lg shadow px-3'>
        <table className='w-full'>
          <thead className='border-b-2 border-gray-200'>
            <tr className='bg-white'>
              <th className='p-3 text-sm font-semibold tracking-wide text-left'>
                Name
              </th>
              <th className='w-28 p-3 text-sm font-semibold tracking-wide text-center'>
                Amount ($)
              </th>
              <th className='w-32 p-3 text-sm font-semibold tracking-wide text-center'>
                Date
              </th>
              <th className='w-20 p-3 text-sm font-semibold tracking-wide text-center'>
                Type
              </th>
              <th className='w-40 p-3 text-sm font-semibold tracking-wide text-center'>
                Category
              </th>
              <th className='w-20 p-3 text-sm font-semibold tracking-wide text-center'>
                Delete
              </th>
              <th className='w-20 p-3 text-sm font-semibold tracking-wide text-center'>
                Edit
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {newOperation.map((operation) => (
              <tr className='bg-white' key={operation._id}>
                <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
                  {operation.name}
                </td>
                <td className='p-3 text-sm text-gray-700 whitespace-nowrap text-center'>
                  {operation.amount}
                </td>
                <td className='p-3 text-sm text-gray-700 whitespace-nowrap text-center'>
                  {operation.date.substring(0, 10)}
                </td>
                <td className='p-3 text-sm whitespace-nowrap text-center'>
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
                <td className='p-3 text-sm text-gray-700 whitespace-nowrap text-center'>
                  {operation.category}
                </td>
                <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
                  <MyModal function={() => handleDelete(operation._id!)} />
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

      <div className='mt-10  w-full'>
        <div className='flex justify-around m-auto'>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
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
    `https://cash-ts.vercel.app/api/operations?limit=10&author=${session?.user?.name}`
  );
  const resExp = await fetch(
    `https://cash-ts.vercel.app/api/operations/expense/${session?.user?.name}`
  );
  const resInc = await fetch(
    `https://cash-ts.vercel.app/api/operations/income/${session?.user?.name}`
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

export default Categories;
