import React from 'react';
import { Task } from './tasksSlice';
import { useDispatch } from 'react-redux';
import { deleteTask } from './tasksSlice';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);

  const onSuccessDeleteHandler = () => {
  MySwal.fire({
      title: "The task has been deleted successfuly",
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 5000,
      showCloseButton: true,
      customClass: {
        popup: 'custom-toast-bg',
        title: 'text-white'
      },
      didOpen: (toast) => {
        toast.style.backgroundColor = '#EF4444';  
      }
  });
}

  const deleteHandler = (id: string) => {
    MySwal.fire({
              icon: 'warning',
              title: "Delete Confirmation",
              text: "Are you sure you want to delete this task",
              showCancelButton: true,
              confirmButtonText: "delete",
              cancelButtonText: "cancel",
              padding: '2em',
              customClass: {
                container: 'bg-gray-800 bg-opacity-90 rounded-lg shadow-lg p-4', 
                title: 'text-2xl font-semibold text-red-500',  
                htmlContainer: 'text-gray-200 text-sm',  
                confirmButton: 'bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600',  
                cancelButton: 'bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600',  
                popup: 'bg-gray-700 text-white',  
              },
              
          }).then((result: any) => {
              if (result.value) {     
                dispatch(deleteTask(id));
                onSuccessDeleteHandler();
              }
    });
}

const imageUrl = task.image ? URL.createObjectURL(task.image) : undefined;

  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-lg flex flex-col space-y-2">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{task.title}</h3>
      {task.image && <img src={imageUrl} alt={task.title} className="mt-2 w-full h-auto rounded" />}
      <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Priority: {task.priority}</p>
      <button className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline" onClick={() => onEdit(task)}>Edit</button>
      <button className="mt-2 text-sm text-red-600 dark:text-blue-400 hover:underline" onClick={() => deleteHandler(task.id) }>Delete</button>
    </div>
  );
};

export default TaskCard;
