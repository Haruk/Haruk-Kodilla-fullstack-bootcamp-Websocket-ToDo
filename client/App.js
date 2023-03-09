import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import shortid from 'shortid';

const App = () => {
  const [socket, setSocket] = useState('');
  const [taskName, setTaskName] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const socket = io('localhost:8000');
    setSocket(socket);

    socket.on('updateData', (serverTasks) => {
      updateTasks(serverTasks);
    });

    socket.on('addTask', ({ task, id }) => {
      addTask({ task, id });
    });

    socket.on('removeTask', (id) => {
      removeTask(id, false);
    });
  }, []);

  const updateTasks = (tasks) => {
    setTasks(tasks);
  };
  const removeTask = (id, isLocal) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
    // setTasks(tasks.filter((task) => task.id !== id));
    if (isLocal) {
      socket.emit('removeTask', id);
    }
  };

  const addTask = (task) => {
    setTasks((tasks) => [...tasks, task]);
  };

  const submitForm = (e) => {
    e.preventDefault();
    const id = shortid();
    addTask({ id, task: taskName });
    socket.emit('addTask', { id, task: taskName });
    setTaskName('');
  };

  return (
    <div className='App'>
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className='tasks-section' id='tasks-section'>
        <h2>Tasks</h2>

        <ul className='tasks-section__list' id='tasks-list'>
          {tasks.map((element) => {
            return (
              <li key={element.id} className='task'>
                {element.task}
                <button
                  onClick={() => removeTask(element.id, true)}
                  className='btn btn--red'
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>

        <form onSubmit={submitForm} id='add-task-form'>
          <input
            onChange={(e) => {
              setTaskName(e.target.value);
            }}
            value={taskName}
            className='text-input'
            autoComplete='off'
            type='text'
            placeholder='Type your description'
            id='task-name'
          />
          <button className='btn' type='submit'>
            Add
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;
