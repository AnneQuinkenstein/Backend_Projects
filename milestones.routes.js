const express = require('express');
const client = require('./db');
const router = express.Router();



// get all Steps for a Milestone
router.get('/:id', async(req, res) => {
    const query = `select status, todo, notes, context, nickname from milestones NATURAL JOIN (nextsteps NATURAL LEFT JOIN (responsible NATURAL JOIN users)) where milestone_name=$1`;
    console.log(query)
    try {
        const milestone_name = req.params.id;
        const result = await client.query(query, [milestone_name])
        console.log(result)
        res.send(result.rows);
    } catch (err) {
        console.log(err.stack)
    }
});

//post one milestone
router.post('', async(req, res) => {
    let milestone_name = (req.body.milestone_name) ? req.body.milestone_name : null;
    let status = (req.body.status) ? req.body.status : null;
    let project_id = (req.body.project_id) ? req.body.project_id : null;

    const query = `INSERT INTO milestones(milestone_name, status, project_id) VALUES ($1, $2, $3) RETURNING *`;

    try {
        const result = await client.query(query, [milestone_name, status, project_id])
        console.log(res)
        res.send(result.rows[0]);
    } catch (err) {
        console.log(err.stack)
    }
});

router.get('', async(req, res) => {
    const query = `SELECT * FROM milestones`;

    try {
        const result = await client.query(query)
        console.log(result)
        res.send(result.rows);
    } catch (err) {
        console.log(err.stack)
    }
});


module.exports = router;