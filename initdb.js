const express = require('express');
const client = require('./db');
const initdb = express.Router();
const format = require('pg-format');


initdb.get('/', async(req, res) => {

    // Anlegen der Tabellen
    let queryP = `
            DROP TABLE IF EXISTS meilenstein;  
            DROP TABLE IF EXISTS project;
            CREATE TABLE project(project_id serial PRIMARY KEY, project_name VARCHAR(50), topic TEXT, deadline DATE NOT NULL DEFAULT CURRENT_DATE);
            CREATE TABLE meilenstein(meilenstein_name VARCHAR(50) PRIMARY KEY,status VARCHAR(30),project_id INTEGER REFERENCES project ON DELETE SET NULL) ;
            `;

    try {
        await client.query(queryP)
        console.log("Table created successfully ...")
    } catch (err) {
        console.log(err)
    }


    // Befüllen der Tabellen
    const projects = [
        ["Webseite erstellen", "PEAN-Stack Webseite erstellen", "2024-03-26"],
        ["irgendwas anderes", "nix", "2023-01-20"]
    ];

    const meilensteine = [
        ['Frontend', 'toDo', 1],
        ['Backend', 'toDo', 1]
        ];
    
    // hierfuer muss pg-format installiert werden (wegen %L):
    const projectquery = format('INSERT INTO project(project_name, topic, deadline) VALUES %L RETURNING *', projects);
    const meilensteinquery = format('INSERT INTO meilenstein(meilenstein_name, status, project_id) VALUES %L RETURNING *', meilensteine);



    try {
        const projectsresult = await client.query(projectquery)
        console.log("projects inserted ...")
        const meilensteineresult = await client.query(meilensteinquery)
        console.log("meilensteine inserted ...")
        res.status(200)
        //lieber als Object project: project.... als als Array
        res.send([ projectsresult.rows, meilensteineresult.rows])
    } catch (err) {
        console.log(err)
    }

});


module.exports = initdb;
