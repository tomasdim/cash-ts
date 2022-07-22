import Image from 'next/image';
import { useRouter } from 'next/router';

const NoOperations = () => {
  const router = useRouter();
  return (
    <div className='pt-5'>
      <div className='flex items-center flex-col'>
        <Image src='/img/no_operations.svg' alt='' height={250} width={250} />
        <div className='text-lg underline underline-offset-1'>
          You don't have any registered operation!
        </div>
        <button
          className='bg-blue-500 p-3 mt-5 rounded-lg text-white hover:bg-blue-400'
          onClick={() => router.push(`/operations/new`)}
        >
          Create new operation
        </button>
      </div>
    </div>
  );
};

export default NoOperations;
