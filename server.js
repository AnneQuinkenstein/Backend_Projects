const express = require('express');
const cors = require('cors');
require('dotenv').config();
const projectRoutes = require('./projects.routes');
const usersRoutes = require('./users.routes');
const init = require('./initdb');
const milestones = require('./milestones.routes');

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());

app.use('/init', init);
app.use('/projects', projectRoutes);
app.use('/users', usersRoutes);
app.use('/milestones', milestones);


app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Server started and listening on port ${PORT} ...`);
    }
})