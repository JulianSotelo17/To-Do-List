import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTasks, createTask, updateTask, deleteTask } from '../../services/api';
import { toast } from 'react-hot-toast';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId) => {
    try {
      const response = await getTasks(userId);
      return response;
    } catch (error) {
      toast.error('Failed to fetch tasks');
      throw error;
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async ({ title, description, userId }) => {
    try {
      const response = await createTask(title, description, userId);
      toast.success('Task created successfully');
      return response;
    } catch (error) {
      toast.error('Failed to create task');
      throw error;
    }
  }
);

export const removeTask = createAsyncThunk(
  'tasks/removeTask',
  async (taskId) => {
    try {
      await deleteTask(taskId);
      toast.success('Task deleted successfully');
      return taskId;
    } catch (error) {
      toast.error('Failed to delete task');
      throw error;
    }
  }
);

export const toggleTaskComplete = createAsyncThunk(
  'tasks/toggleComplete',
  async ({ taskId, completed }) => {
    try {
      const response = await updateTask(taskId, { completed });
      return response;
    } catch (error) {
      toast.error('Failed to update task');
      throw error;
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    loading: false,
    error: null,
    searchQuery: '',
    sortOrder: 'desc',
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(toggleTaskComplete.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      });
  },
});

export const { setSearchQuery, toggleSortOrder } = tasksSlice.actions;
export default tasksSlice.reducer;