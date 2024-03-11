const express = require('express');
const router = express.Router();
const client = require('./db')
const bcrypt = require('bcrypt')
require('dotenv').config();

// login user
router.post('/login', async(req,res) => {
    let nickname = req.body.nickname;
    let password = req.body.password;
    let check = await client.query('SELECT * FROM users WHERE nickname = $1', [nickname])
    if(check.rowCount > 0) {
        let user = check.rows[0];
        console.log("password" + user.password)
        let loginOk = await bcrypt.compare(password, user.password)
        if(loginOk) {
            res.status(200)
            res.send({ message: `user ${nickname} logged in`})
        } else {
            res.status(401)
            res.send({ message: 'wrong password'})
        }
    } else {
        res.status(400).json({ error: 'username does not exist' });
    }

})


// create new user
router.post('/register', async(req,res) => {
    let nickname = req.body.nickname;
    let password = req.body.password;
    let hashPassword = await bcrypt.hash(password, 10);
    console.log('hash : ', hashPassword)

    let check = await client.query('SELECT * FROM users WHERE nickname = $1', [nickname])
    if(check.rowCount > 0) {
        res.status(409)
        res.send({ message: `Nickname ${nickname} already exists`})
    } else {
        const query = `INSERT INTO users(nickname, password) VALUES ($1, $2) RETURNING *`;

        let result = await client.query(query, [nickname, hashPassword]);
        res.status(201)
        res.send(result.rows[0])
    }
})

// get all users
router.get('', async(req, res) => {
    const query = `SELECT * FROM users `;

    try {
        const result = await client.query(query)
        console.log(res)
        res.send(result.rows);
    } catch (err) {
        console.log(err.stack)
    }
});

// get one user via id
router.get('/:id', async(req, res) => {
    const query = `SELECT * FROM users WHERE nickname=$1`;

    try {
        const nickname = req.params.id;
        const result = await client.query(query, [nickname])
        console.log(result)
        if (result.rowCount == 1)
            res.send(result.rows[0]);
        else
            res.send({ message: "No user found with nickname=" + nickname });
    } catch (err) {
        console.log("error", err.stack)
    }
});


// update one user
router.put('/:id', async(req, res) => {
    const query = `SELECT * FROM users WHERE nickname=$1`;
    let nickname = req.params.id;
    const result = await client.query(query, [nickname])
    if(result.rowCount > 0) {
        let user = result.rows[0];
        let nickname = (req.body.nickname) ? req.body.nickname : user.nickname;
        let password = (req.body.password) ? req.body.password : user.password;

        const updatequery = `UPDATE users SET
            password = $2,
            WHERE nickname=$1
            RETURNING *;`;

        const updateresult = await client.query(updatequery, [password, nickname]);
        console.log('updateresult : ', updateresult)
        res.send(updateresult.rows[0]);

    } else {
        res.status(404)
        res.send({
            error: "User with id=" + nickname + " does not exist!"
        })
    }
});

module.exports = router;