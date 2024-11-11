const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
    title: { type: String, required: true},
    description: { type: String },
    completed: { type: Boolean, default: false},
    task: { type: mongoose.Schema.Types.ObjetId, ref: 'Task', required: true}
});

const SubTask = mongoose.model('SubTask', subTaskSchema);
module.exports = SubTask;