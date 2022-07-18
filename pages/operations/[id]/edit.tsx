import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function EditOperation() {
  const [newOperation, setNewOperation] = useState({
    name: '',
    amount: '',
    type: '',
    category: '',
  });

  const router = useRouter();
  const { id } = router.query;

  const handleSubmit = async (e) => {
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
    setNewOperation({
      name: data.name,
      amount: data.amount,
      type: data.type,
      category: data.category,
    });
    console.log(data);
  };

  useEffect(() => {
    if (router.query.id) getOperation();
  }, []);

  const handleChange = (e) =>
    setNewOperation({ ...newOperation, [e.target.name]: e.target.value });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Nombre'
          name='name'
          onChange={handleChange}
          value={newOperation.name}
        ></input>
        <input
          type='text'
          placeholder='Cantidad'
          name='amount'
          onChange={handleChange}
          value={newOperation.amount}
        ></input>
        {/* <input
          type='text'
          placeholder='Tipo'
          name='type'
          onChange={handleChange}
          value={newOperation.type}
        ></input> */}
        <select name='type' value={newOperation.type} onChange={handleChange}>
          <option value='income'>Income</option>
          <option value='expense'>Expense</option>
        </select>
        <input
          type='text'
          placeholder='Categoría'
          name='category'
          onChange={handleChange}
          value={newOperation.category}
        ></input>
        <button className='bg-blue-400 text-white border-red-300'>
          Update
        </button>
      </form>
    </div>
  );
}

export default EditOperation;
