const express = require('express');
const client = require('./db');
const router = express.Router();

// get all projects
router.get('', async(req, res) => {
    const queryProject = `SELECT * FROM project`;

    const queryMilestones = `SELECT * FROM milestones where project_id = project_id`

    async function getMilestones(project_id) {
        const result = await client.query(queryMilestones, [project_id])
        console.log("result " + result)
        return result.rows
    }

    try {
        const result = await client.query(queryProject)
        const projects = result.rows
        //js - for jedes Projekt die milestones dazupatschen?
        projects.forEach((project) => console.log("milestones " + getMilestones(project.project_id)))
        res.send(result.rows);
    } catch (err) {
        console.log(err.stack)
    }
});

// post one project
router.post('', async(req, res) => {
    let project_name = (req.body.project_name) ? req.body.project_name : null;
    let topic = (req.body.topic) ? req.body.topic : null;
    let deadline = (req.body.deadline) ? req.body.deadline : null;

    const query = `INSERT INTO project(project_name, topic, deadline) VALUES ($1, $2, $3) RETURNING *`;

    try {
        const result = await client.query(query, [project_name, topic, deadline])
        console.log(res)
        res.send(result.rows[0]);
    } catch (err) {
        console.log(err.stack)
    }
});

// get one proejct via id
router.get('/:id', async(req, res) => {
    const query = `SELECT * FROM project WHERE project_id=$1`;

    try {
        const id = req.params.id;
        const result = await client.query(query, [id])
        console.log(result)
        if (result.rowCount == 1)
            res.send(result.rows[0]);
        else
            res.send({ message: "No project found with id=" + id });
    } catch (err) {
        console.log("error", err.stack)
    }
});

// update one project
router.put('/:id', async(req, res) => {
    const query = `SELECT * FROM project WHERE project_id=$1`;

    let project_id = req.params.id;
    const result = await client.query(query, [project_id])
    if(result.rowCount > 0)
    {
        let project = result.rows[0];
        let project_name = (req.body.project_name) ? req.body.project_name : project.project_name;
        let topic = (req.body.topic) ? req.body.topic : project.topic;
        let deadline = (req.body.deadline) ? req.body.deadline : project.deadline;

        const updatequery = `UPDATE project SET 
            project_name = $1, 
            topic = $2,
            deadline = $3
            WHERE project_id=$4;`;
        const updateresult = await client.query(updatequery, [project_name, topic, deadline, project_id]);
        console.log(updateresult)
        res.send({ project_id, project_name, topic, deadline });
    } else {
        res.status(404)
        res.send({
            error: "Project with id=" + id + " does not exist!"
        })
    }
});


// delete one project via id
router.delete('/project/:id', async(req, res) => {
    const query = `DELETE FROM project WHERE project_id=$1`;

    try {
        const id = req.params.id;
        const result = await client.query(query, [id])
        console.log(result)
        if (result.rowCount == 1)
            res.send({ message: "Project with id=" + id + " deleted" });
        else
            res.send({ message: "No project found with id=" + id });
    } catch (err) {
        console.log(err.stack)
    }
});


module.exports = router;