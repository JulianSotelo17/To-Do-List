import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SortAsc, SortDesc, Plus, Check, Trash2 } from 'lucide-react';
import { fetchTasks, removeTask, toggleTaskComplete, setSearchQuery, toggleSortOrder } from '../../store/slices/tasksSlice';
import TaskForm from './TaskForm';

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, searchQuery, sortOrder, loading } = useSelector((state) => state.tasks);
  const userId = useSelector((state) => state.auth.user?._id);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTasks(userId));
    }
  }, [dispatch, userId]);

  const filteredAndSortedTasks = [...tasks]
    .filter((task) => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const handleDelete = (taskId) => {
    dispatch(removeTask(taskId));
  };

  const handleToggleComplete = (taskId, completed) => {
    dispatch(toggleTaskComplete({ taskId, completed }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <TaskForm />
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => dispatch(toggleSortOrder())}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
          Sort
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {filteredAndSortedTasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </h3>
                    <p className="mt-2 text-gray-600">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleToggleComplete(task._id, !task.completed)}
                      className={`p-2 rounded-full ${
                        task.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      } hover:bg-opacity-80 transition-colors`}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-opacity-80 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default TaskList;