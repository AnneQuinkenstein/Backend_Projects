const express = require('express');
const client = require('./db');
const router = express.Router();



// get all Steps for a Milestone
router.get('/:id', async(req, res) => {
    const query = `select status, todo, notes, context, nickname from milestones NATURAL JOIN (nextsteps NATURAL JOIN (responsible NATURAL JOIN users)) where milestone_name=$1`;
    //TODO: outer left join oder sowas, da wo user auch null sein können
    console.log(query)
    try {
        const project_id = req.params.id;
        const result = await client.query(query, [project_id])
        console.log(result)
        res.send(result.rows);
    } catch (err) {
        console.log(err.stack)
    }
});


module.exports = router;