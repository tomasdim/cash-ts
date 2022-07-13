import { useState } from 'react';

const newOperation = () => {
  const [newOperation, setNewOperation] = useState({
    name: '',
    amount: '',
    type: '',
    category: '',
  });
  // const [errors, setErrors] = useState({});

  // const validate = () => {
  //   const errors = {};
  //   if (!newOperation.name) errors.name = 'Title is required!';
  //   if (!newOperation.amount) errors.amount = 'Amount is required!';
  //   if (!newOperation.type) errors.type = 'Type is required!';
  //   if (!newOperation.category) errors.category = 'Category is required!';

  //   return errors;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // let errors = validate();
    // if (Object.keys(errors).length) return setErrors(errors);
    await createOperation();
    console.log('submit');
  };

  const createOperation = async () => {
    try {
      await fetch('http://localhost:3000/api/operations', {
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
        ></input>
        <input
          type='text'
          placeholder='Cantidad'
          name='amount'
          onChange={handleChange}
        ></input>
        <input
          type='text'
          placeholder='Tipo'
          name='type'
          onChange={handleChange}
        ></input>
        <input
          type='text'
          placeholder='Categoría'
          name='category'
          onChange={handleChange}
        ></input>
        <button className='bg-blue-400 text-white border-red-300'>Save</button>
      </form>
    </div>
  );
};

export default newOperation;
