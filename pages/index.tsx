import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import Navbar from '../components/navbar/Navbar';
import { Props } from '../utils/types';
import NoOperations from '../components/index/NoOperations';
import MyModal from '../components/modal/Modal';
import { useState, useEffect } from 'react';
import { LeftArrow, RightArrow } from '../components/icons';

const Home: NextPage<Props> = (props: Props) => {
  const [isLoadingNew, setIsLoadingNew] = useState(false);
  const [isLoadingCat, setIsLoadingCat] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageCount, setCurrentPageCount] = useState(
    props.pagedOperations.pagination.pageCount
  );
  const [newOperation, setNewOperation] = useState(props.pagedOperations);
  const [currentCategory, setCurrentCategory] = useState('');
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

  const createOperation = () => {
    setIsLoadingNew(true);
    router.push(`/operations/new`);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`https://cash-ts.vercel.app/api/operations/${id}`, {
        method: 'DELETE',
      });
      location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  function reformatDate(dateStr: string) {
    let dArr = dateStr.split('-'); // ex input "2010-01-18"
    return dArr[2] + '/' + dArr[1] + '/' + dArr[0]; //ex out: "18/01/10"
  }

  const removeDuplicates = (data: string[]) => {
    return data.filter((value, index) => data.indexOf(value) === index);
  };

  const filteredCategories = removeDuplicates(cat as string[]);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filteredOperations = await fetch(
      `https://cash-ts.vercel.app/api/operations?page=1&category=${e.target.value}&author=${props.session.user.name}`,
      { method: 'GET' }
    );
    setIsLoadingCat(true);
    setCurrentCategory(e.target.value);
    setCurrentPage(1);
    const resFiltered = await filteredOperations.json();
    setNewOperation(resFiltered);
    setCurrentPageCount(resFiltered.pagination.pageCount);
    setIsLoadingCat(false);
  };

  const handlePrevious = async () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePrevious2 = async () => {
    if (currentPage > 1) setCurrentPage(currentPage - 2);
  };

  const handleNext = async () => {
    if (currentPage < currentPageCount) setCurrentPage(currentPage + 1);
  };

  const handleNext2 = async () => {
    if (currentPage < currentPageCount) setCurrentPage(currentPage + 2);
  };

  useEffect(() => {
    const paginatedOperations = async () => {
      const data = await fetch(
        `https://cash-ts.vercel.app/api/operations?page=${currentPage}&author=${props.session.user.name}&category=${currentCategory}`,
        { method: 'GET' }
      );
      const dataFiltered = await data.json();
      if (dataFiltered.pagination.pageCount === 0) {
        setNewOperation(props.pagedOperations);
        console.log('SECOND useEffect called first instance');
      } else setNewOperation(dataFiltered);
      console.log('SECOND useEffect called second instance');
    };
    paginatedOperations().catch(console.error);
  }, [currentPage]);

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
        <h1 className='text-green-800 underline flex justify-center text-lg font-semibold'>
          Filter by category:
        </h1>
        {isLoadingCat ? (
          <div className='flex items-center justify-center'>
            <img
              className='rounded-lg bg-green-800 flex items-center w-6 h-6'
              src='/img/rings.svg'
            ></img>
          </div>
        ) : (
          ''
        )}
        <select className='border border-green-800 m-1' onChange={handleChange}>
          <option value=''>All</option>
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
              <th className=' w-28 p-3 text-sm font-semibold tracking-wide text-center'>
                Amount ($)
              </th>
              <th className='w-32 p-3 text-sm font-semibold tracking-wide text-center'>
                Date
              </th>
              <th className=' w-20 p-3 text-sm font-semibold tracking-wide  text-center'>
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
            {newOperation.items.map((operation) => (
              <tr className='bg-white' key={operation._id}>
                <td className='p-3 text-sm text-gray-700 whitespace-nowrap'>
                  {operation.name}
                </td>
                <td className='text-center p-3 text-sm text-gray-700 whitespace-nowrap'>
                  {operation.amount}
                </td>
                <td className='p-3 text-sm text-gray-700 whitespace-nowrap text-center'>
                  {reformatDate(operation.date.substring(0, 10))}
                </td>
                <td className='p-3 text-sm whitespace-nowrap'>
                  <span
                    className={`p-1.5  text-xs font-medium uppercase tracking-wider ${
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

      <div className='w-full justify-around pt-10 flex items-center'>
        <button
          className='bg-blue-500 p-3  rounded-lg text-white hover:bg-blue-400'
          onClick={createOperation}
        >
          {isLoadingNew ? (
            <div className='flex items-center justify-center'>
              <img
                className='flex items-center w-40 h-6'
                src='/img/rings.svg'
              ></img>
            </div>
          ) : (
            'Create new operation'
          )}
        </button>
        <div className='flex'>
          <button
            className='flex items-center justify-center w-7 h-7 hover:border-2 rounded-full p-2'
            disabled={currentPage === 1}
            onClick={handlePrevious}
          >
            <LeftArrow />
          </button>
          <button
            onClick={handlePrevious}
            className={`${
              currentPage === 1
                ? 'hidden'
                : 'mx-1 flex items-center justify-center w-6 h-6 hover:border-2 rounded-full p-2'
            }`}
          >
            {currentPage - 1}
          </button>
          <div className='mx-1 flex items-center justify-center w-6 h-6 hover:border-2 font-semibold text-white border-blue-400 bg-blue-400 rounded-full p-2'>
            {currentPage}
          </div>
          <button
            onClick={handleNext}
            className={`${
              currentPage === currentPageCount
                ? 'hidden'
                : 'mx-1 flex items-center justify-center w-6 h-6 hover:border-2 rounded-full p-2'
            }`}
          >
            {currentPage + 1}
          </button>
          <button
            onClick={handleNext2}
            className={`${
              currentPage + 2 > currentPageCount
                ? 'hidden'
                : 'mx-1 flex items-center justify-center  w-6 h-6 hover:border-2 rounded-full p-2'
            }`}
          >
            {currentPage + 2}
          </button>
          <button
            className='flex items-center justify-center w-7 h-7 hover:border-2 rounded-full p-2'
            disabled={currentPage === currentPageCount}
            onClick={handleNext}
          >
            <RightArrow />
          </button>
        </div>
        <div className='flex'>
          <h1 className='text-lg p-3 bg-orange-300 rounded-lg'>
            Balance: {sumInc - sumExp}
          </h1>
        </div>
      </div>
      <div className='mt-10  w-full'>
        <div className='flex justify-around  m-auto'></div>
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
    `https://cash-ts.vercel.app/api/operations?&author=${session?.user?.name}`
  );
  const pagedRes = await fetch(
    `https://cash-ts.vercel.app/api/operations?&page=1&author=${session?.user?.name}`
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
  const pagedOperations = await pagedRes.json();

  return {
    props: {
      operations: operations,
      session: session,
      expenses: expenses,
      income: income,
      pagedOperations: pagedOperations,
    },
  };
};

export default Home;
