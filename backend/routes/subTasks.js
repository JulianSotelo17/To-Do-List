const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

router.get('/:id', async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);
    
        if (!task) {
            res.status(404).json({ message: "Task not found"});
        }

        cont 
    }catch(error){
        res.status(500).json({message: "Server error", error});
    }
})
