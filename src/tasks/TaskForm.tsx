import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  defaultValues?: TaskFormData;
  onReset?: () => void;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  state: 'todo' | 'doing' | 'done';
  image?: FileList | File | null;
}

const taskSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  priority: yup.string().oneOf(['Low', 'Medium', 'High']).required(),
  state: yup.string().oneOf(['todo', 'doing', 'done']).required(),
  image: yup.mixed<File | FileList>().optional().nullable(),
});

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, defaultValues }) => {
    const MySwal = withReactContent(Swal);

    const onSuccessSaveHandler = () => {
        MySwal.fire({
            title: "The Task has been added successfuly",
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
                toast.style.backgroundColor = '#31a220';  
            }
        });
    }

  const { register, handleSubmit, formState: { errors },reset,setValue } = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema),
    defaultValues,
  });

  const onFormSubmit = (data: TaskFormData) => {
    const image = data.image instanceof FileList ? data.image[0] : data.image;  
    onSubmit({ ...data, image: image || defaultValues?.image });
    onSuccessSaveHandler();
    reset(); 
    setImagePreview(null)  
  };

  useEffect(() => {
    if (defaultValues) {
        if (defaultValues.title) {
            setValue("title",defaultValues.title);
        }
        if (defaultValues.priority) {
            setValue("priority",defaultValues.priority);
        }
        if (defaultValues.state) {
            setValue("state",defaultValues.state);
        }
        if (defaultValues.description) {
            setValue("description",defaultValues.description);
        }
        if (defaultValues.image) {
          setImagePreview(
            defaultValues.image instanceof FileList ? URL.createObjectURL(defaultValues.image[0]) : URL.createObjectURL(defaultValues.image)
          );
        }
    }
  },[defaultValues,setValue])

  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues?.image
      ? URL.createObjectURL(
          defaultValues.image instanceof FileList ? defaultValues.image[0] : defaultValues.image
        )
      : null
  );

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg flex flex-col space-y-4">
      <input {...register('title')}   placeholder="Title" className="p-2 rounded-md border dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700" />
      <p>{errors.title?.message}</p>

      <textarea {...register('description')}   placeholder="Description" className="p-2 rounded-md border dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700" />
      <p>{errors.description?.message}</p>

      <select {...register('priority')} className="p-2 rounded-md border dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700">
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <p>{errors.priority?.message}</p>

      <select {...register('state')} className="p-2 rounded-md border dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700">
        <option value="todo">To Do</option>
        <option value="doing">Doing</option>
        <option value="done">Done</option>
      </select>
      <p>{errors.state?.message}</p>

      <div className='flex flex-col gap-2 '>
      <label className='dark:text-gray-400'>Image</label>
      <input
        type="file"
        {...register('image')}
        accept="image/" 
        onChange={handleImageChange}
        className="mb-2"
      />
      </div>
      {imagePreview && (
        <div className="mb-4">
          <img src={imagePreview} alt="Preview" className="w-[100px] h-auto rounded" />
        </div>
      )}

      <button className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" type="submit">{defaultValues ? 'Update Task' : 'Add Task'}</button>
    </form>
  );
};

export default TaskForm;
