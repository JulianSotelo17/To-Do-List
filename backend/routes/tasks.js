const express = require('express');
const Task = require('../models/Task');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../Middleware/middleware');


router.get('/', authMiddleware, async (req, res) => {
    try {
        // Encuentra tareas del usuario autenticado usando req.userId
        const tasks = await Task.find({ user: req.userId }).populate('user');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const updateTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updateTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(updateTask);
    } catch (error) {
        console.error("Error updating task:", error); // Muestra el error en la terminal si ocurre uno
        res.status(500).json({ message: "Server error" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }   

        const user = await User.findById(deletedTask.user);

        if(!user){
            return res.status(404).json({ message: 'User not found'});
        }

        user.tasks = user.tasks.filter(taskId => taskId.toString() !== deletedTask._id.toString());

        await user.save();

        res.json({ message: 'Task deleted successfully', task: deletedTask });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', async (req, res) => {
    const { title, description, userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "UserId is required" });
    }

    try {
        const newTask = new Task({
            title,
            description,
            user: userId,
        });
        const savedTask = await newTask.save();

        // Encuentra el usuario y agrega la tarea a su lista
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.tasks.push(savedTask._id);
        await user.save();

        res.status(201).json(savedTask);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Server error" });
    }
});



module.exports = router;