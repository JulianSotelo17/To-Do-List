const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
       
       const user = await User.findOne({ email });
       if (user) {
        return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Server error" });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generar el token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Incluir usuario en la respuesta
        res.json({ token, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get('/:userId', async (req, res) => {
    try{
        const tasks = await Task.find({ user: req.params.userId }).populate('user', 'username');
        res.json(tasks);
    }catch(error){
        res.status(500).json({ message: "Error fetching tasks", error});
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { taskIds } = req.body; // El array de taskIds a agregar

        // Verificar que el usuario exista
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Agregar las nuevas tareas al array de tareas del usuario
        user.tasks.push(...taskIds); // Agrega los taskIds que vienen en el body
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});



module.exports = router;