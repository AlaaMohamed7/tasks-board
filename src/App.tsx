import  { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask, moveTask, selectTasks } from './tasks/tasksSlice';
import TaskForm, { TaskFormData } from './tasks/TaskForm';
import TaskCard from './tasks/TaskCard';
import { Task } from './tasks/tasksSlice';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const priorityOptions = ['All', 'Low', 'Medium', 'High'];

export default function App() {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  const handleAddTask = (data: TaskFormData) => {
    dispatch(addTask(data));
  };

  const handleEditTask = (data: TaskFormData) => {
    if (editingTask) {
      dispatch(updateTask({ ...editingTask, ...data }));
      setEditingTask(null);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    const newState = destination.droppableId as Task['state'];
    dispatch(moveTask({ id: draggableId, state: newState }));
  };

  const renderTasks = (state: Task['state']) => (
    <Droppable droppableId={state}>
      {(provided) => (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow-md w-72 flex flex-col space-y-4" ref={provided.innerRef} {...provided.droppableProps}>
          {tasks
            .filter((task) => task.state === state && 
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
            (selectedPriority === 'All' || task.priority === selectedPriority))
            .map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard task={task} onEdit={setEditingTask} />
                  </div>
                )}
              </Draggable>
            ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-10 overflow-x-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">Tasks Board</h1>
      <div className='flex gap-5  mb-10'>
        <div className=''>

      <label htmlFor='search' className='dark:text-white font-bold text-[16px] mx-5' >Search</label> 
      <input
        type="text"
        name='search'
        placeholder="Search by task title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700"
      />
        </div>

        <div>

        <label htmlFor='priority' className='dark:text-white font-bold text-[16px] mx-5' >Priority</label> 
      <select
        title='priority'
        value={selectedPriority}
        name='priority'
        onChange={(e) => setSelectedPriority(e.target.value)}
        className="mb-4 p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700"
      >
        {priorityOptions.map((priority) => (
          <option key={priority} value={priority}>{priority}</option>
        ))}
      </select>
        </div>

      </div>
      

      <div className="flex flex-col lg:flex-row gap-8 justify-center lg:items-start items-center">
        {editingTask ? (
          <TaskForm onSubmit={editingTask ? handleEditTask : handleAddTask} 
          defaultValues={editingTask || undefined} />
        ) : (
          <TaskForm onSubmit={handleAddTask} />
        )}
        <div className='flex gap-4 overflow-x-scroll lg:w-auto w-[90%]'>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">To Do</h2>
            {renderTasks('todo')}
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Doing</h2>
            {renderTasks('doing')}
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Done</h2>
            {renderTasks('done')}
          </div>
        </DragDropContext>
        </div>

      </div>
    </div>
  );
};