import axios from 'axios';
import React, { useEffect, useState } from 'react';

const App = () => {
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [todo, setTodo] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editInput, setEditInput] = useState('');
  const [alert, setAlert] = useState('');

  useEffect(() => {
    async function getData() {
      const response = await axios('https://judicial-margarita-syedaabeerfatima-d1f9886e.koyeb.app/api/v1/todo');
      console.log(response.data);
      setTodo(response.data.data);
    }

    getData();
  }, []);

  const addTodo = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://judicial-margarita-syedaabeerfatima-d1f9886e.koyeb.app/api/v1/todo', {
        title: input,
        description,
      });

      setTodo([...todo, response.data.data]);
      setInput('');
      setDescription('');
      setAlert({ type: 'success', message: 'Todo added successfully!' });

      setTimeout(() => setAlert(''), 3000); // Close alert after 3 seconds
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to add todo.' });
      setTimeout(() => setAlert(''), 3000);
    }
  };

  // const editTodo = (id, title, description) => {
  //   console.log(id)
  //   console.log(title)
  //   setEditId(id);
  //   setEditInput(title);
  //   setInput(title);  // Pre-fill the input with the current title
  //   setDescription(description);  // Pre-fill the description
  //   // console.log(editId)
  //   // console.log(editInput)
  //   // console.log(input)
  //   // console.log(description)

  // };
  const editTodo = (item) => {
    console.log('ID:', item._id); // Log the ID
    console.log('Title:', item.title); // Log the title
  
    setEditId(item._id); // Schedule editId state update
    setInput(item.title); // Schedule input state update
    setDescription(item.description); // Schedule description state update
  
    // Log the state updates in the next render cycle
    setTimeout(() => {
      console.log('Updated State - Edit ID:', editId);
      console.log('Updated State - Input:', input);
      console.log('Updated State - Description:', description);
    }, 3000);
  };
  
  const updateTodo = async () => {
    event.preventDefault();
    try {
      const response = await axios.put(`https://judicial-margarita-syedaabeerfatima-d1f9886e.koyeb.app/api/v1/todo/${editId}`, {
        title: input, // Use the current input for the title
        description,
      });

      // Update the todo in the list directly
      const updatedTodos = todo.map((item) =>
        item._id === editId ? { ...item, title: input, description } : item
      );
      setTodo(updatedTodos);
      setEditId(null);
      setEditInput('');
      setInput('');
      setDescription('');
      setAlert({ type: 'success', message: 'Todo updated successfully!' });
      setTimeout(() => setAlert(''), 3000);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update the todo.' });
      setTimeout(() => setAlert(''), 3000);
    }
  };

  const deleteTodo = async (id, index) => {
    try {
      await axios.delete(`https://judicial-margarita-syedaabeerfatima-d1f9886e.koyeb.app/api/v1/todo/${id}`);
      const updatedTodos = [...todo];
      updatedTodos.splice(index, 1);
      setTodo(updatedTodos);
      setAlert({ type: 'success', message: 'Todo deleted successfully!' });
      setTimeout(() => setAlert(''), 3000);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete the todo.' });
      setTimeout(() => setAlert(''), 3000);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-6">Todo App</h1>

      {alert && (
        <div
          className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}
        >
          <span>{alert.message}</span>
        </div>
      )}

      <form onSubmit={editId ? updateTodo : addTodo} className="mb-8 space-y-4">
        <input
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Enter your todo"
          value={input}
          className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          placeholder="Enter description"
          className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-6 rounded w-full hover:bg-blue-600"
        >
          {editId ? 'Update Todo' : 'Add Todo'}
        </button>
      </form>

      <ul className="space-y-6">
        {todo ? (
          todo.map((item, index) => (
            <li
              key={item._id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 relative"
            >
              <div className="space-y-2">
                <div className="font-semibold text-lg">{item.title}</div>
                <div className="text-gray-600">{item.description}</div>
              </div>
              <div className="absolute bottom-2 right-2 flex space-x-3">
                <button
                  onClick={() => deleteTodo(item._id, index)}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => editTodo(item)}
                  className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
              </div>
            </li>
          ))
        ) : (
          <h1>Loading...</h1>
        )}
      </ul>
    </div>
  );
};

export default App;
