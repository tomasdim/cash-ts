import React from 'react';
import Error from 'next/error';
import { useRouter } from 'next/router';

const OperationId = (props) => {
  const router = useRouter();

  const deleteOperation = async () => {
    const { id } = router.query;
    try {
      await fetch(`http://localhost:3000/api/operations/${id}`, {
        method: 'DELETE',
      });
      console.log('Operation has been deleted!');
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  if (props.error && props.error.statusCode)
    return (
      <Error
        statusCode={props.error.statusCode}
        title={props.error.statusText}
      />
    );
  return (
    <div>
      <h1>{props.operation.name}</h1>
      <p>{props.operation.amount}</p>
      <button
        onClick={() => {
          deleteOperation();
        }}
        className=' bg-white text-red-500'
      >
        Delete
      </button>
      {/* {JSON.stringify(props.operation)} */}
    </div>
  );
};

export default OperationId;

export async function getServerSideProps(context) {
  const res = await fetch(
    `http://localhost:3000/api/operations/${context.query.id}`
  );
  if (res.status === 200) {
    const operation = await res.json();
    return {
      props: {
        operation,
      },
    };
  }
  return {
    props: {
      error: {
        statusCode: res.status,
        statusText: 'Invalid ID',
      },
    },
  };
}
