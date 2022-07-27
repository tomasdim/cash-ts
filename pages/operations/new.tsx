import { ChangeEvent, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { getSession, signOut } from 'next-auth/react';
import Navbar from '../../components/navbar/Navbar';
import { Props } from '../../utils/types';

const NewOperation = (props: Props) => {
  const [newOperation, setNewOperation] = useState({
    name: '',
    amount: '',
    type: 'income',
    category: '',
    author: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createOperation();
    console.log('submit');
    await Router.push('/');
  };

  const createOperation = async () => {
    try {
      await fetch(`https://cash-ts.vercel.app/api/operations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOperation),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) =>
    setNewOperation({
      ...newOperation,
      [e.target.name]: e.target.value,
      author: props.session.user.name,
    });

  return (
    <div>
      <Navbar
        username={props.session.user.name}
        img={props.session.user.image}
      />
      <div className='background h-screen'>
        <div className='block lg:mx-60   pt-5'>
          <form className=' bg-white rounded-lg p-5' onSubmit={handleSubmit}>
            <div>
              <label className='block text-sm font-medium text-gray-500'>
                Name
              </label>
              <input
                type='text'
                placeholder='Name'
                name='name'
                required
                maxLength={35}
                onChange={handleChange}
                className='block w-full rounded-lg border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm'
              ></input>
              <label className=' block text-sm font-medium text-gray-500 py-3'>
                Amount ($)
              </label>
              <input
                className='block w-full rounded-lg border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm'
                type='number'
                placeholder='Amount'
                required
                name='amount'
                max='9999999'
                onChange={handleChange}
              ></input>
            </div>
            <label className=' block text-sm font-medium text-gray-500 py-3'>
              Date
            </label>
            <input
              className='block w-full rounded-lg border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm'
              type='date'
              required
              name='date'
              onChange={handleChange}
            ></input>
            {/* <input
          type='text'
          placeholder='Tipo'
          name='type'
          onChange={handleChange}
        ></input> */}
            <label className='block text-sm font-medium text-gray-500 py-3'>
              Type
            </label>
            <select
              className='block w-full rounded-lg border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm'
              name='type'
              required
              onChange={(e) => {}}
            >
              <option value='income'>Income</option>
              <option value='expense'>Expense</option>
            </select>
            <label className=' block text-sm font-medium text-gray-500 py-3'>
              Category
            </label>
            <input
              className='block w-full rounded-lg border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm'
              type='text'
              placeholder='Category'
              name='category'
              required
              onChange={handleChange}
            ></input>
            <button className='w-full p-3 mt-3 rounded-lg bg-blue-400 text-white border-red-300'>
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: object
) => {
  const session = await getSession(context);
  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  return {
    props: {
      session: session,
    },
  };
};

export default NewOperation;
