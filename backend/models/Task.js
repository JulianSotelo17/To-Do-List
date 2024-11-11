const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    // subTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubTask'}],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});


const Task = mongoose.model('Task', taskSchema);
module.exports = Task;