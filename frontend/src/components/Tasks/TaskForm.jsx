import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { addTask } from '../../store/slices/tasksSlice';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // if (!title.trim() || !userId) return;

    try {
      await dispatch(addTask({ title, description, userId }));
      setTitle('');
      setDescription('');
      setIsExpanded(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{ height: isExpanded ? 'auto' : '56px' }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="flex-1 text-lg border-none focus:ring-0 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 space-y-4"
          >
            <textarea
              placeholder="Add a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Task
              </button>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default TaskForm;