import { useState, useEffect, ChangeEvent, ChangeEventHandler } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/navbar/Navbar';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { Props } from '../../../utils/types';

function EditOperation(props: Props) {
  const [newOperation, setNewOperation] = useState({
    name: '',
    amount: '',
    date: '',
    type: '',
    category: '',
  });

  const router = useRouter();
  const { id } = router.query;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // let errors = validate();
    // if (Object.keys(errors).length) return setErrors(errors);
    await updateOperation();
    console.log('updating');
    await router.push('/');
  };

  const updateOperation = async () => {
    try {
      await fetch('http://localhost:3000/api/operations/' + router.query.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOperation),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getOperation = async () => {
    const res = await fetch(
      'http://localhost:3000/api/operations/' + router.query.id
    );
    const data = await res.json();
    const newDate = data.date.substring(0, 10);

    setNewOperation({
      name: data.name,
      amount: data.amount,
      date: newDate,
      type: data.type,
      category: data.category,
    });
    console.log(data);
  };

  useEffect(() => {
    if (router.query.id) getOperation();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => setNewOperation({ ...newOperation, [e.target.name]: e.target.value });

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
                value={newOperation.name}
                className='block w-full rounded-lg border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm'
              ></input>
              <label className=' block text-sm font-medium text-gray-500 py-3'>
                Amount ($)
              </label>
              <input
                type='text'
                placeholder='Amount'
                name='amount'
                required
                onChange={handleChange}
                value={newOperation.amount}
                className='block w-full rounded-lg border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm'
              ></input>
            </div>
            <label className=' block text-sm font-medium text-gray-500 py-3'>
              Date
            </label>
            <input
              className='block w-full rounded-lg border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm'
              type='date'
              name='date'
              required
              onChange={handleChange}
              value={newOperation.date}
            ></input>
            <label className='block text-sm font-medium text-gray-500 py-3'>
              Type
            </label>
            <select
              className='block w-full rounded-lg border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm'
              required
              name='type'
              value={newOperation.type}
              onChange={handleChange}
            >
              <option value='income'>Income</option>
              <option value='expense'>Expense</option>
            </select>
            <label className=' block text-sm font-medium text-gray-500 py-3'>
              Category
            </label>
            <input
              required
              className='block w-full rounded-lg border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm'
              type='text'
              placeholder='Category'
              name='category'
              onChange={handleChange}
              value={newOperation.category}
            ></input>
            <button className='w-full p-3 mt-3 rounded-lg bg-blue-400 text-white border-red-300'>
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

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

export default EditOperation;
