const express = require('express');
const client = require('./db');
const initdb = express.Router();
const format = require('pg-format');


initdb.get('/', async(req, res) => {

    // Anlegen der Tabellen
    let queryP = `
            DROP TABLE IF EXISTS responsible; 
            DROP TABLE IF EXISTS participate; 
            DROP TABLE IF EXISTS nextSteps;  
            DROP TABLE IF EXISTS milestones;  
            DROP TABLE IF EXISTS project;
            DROP TABLE IF EXISTS users; 
            CREATE TABLE users(nickname  VARCHAR(50) PRIMARY KEY,password VARCHAR(250) NOT NULL) ; 
            CREATE TABLE project(project_id serial PRIMARY KEY, project_name VARCHAR(50), topic TEXT, deadline DATE NOT NULL DEFAULT CURRENT_DATE);
            CREATE TABLE milestones(milestone_name VARCHAR(50) PRIMARY KEY,status VARCHAR(30),project_id INTEGER REFERENCES project ON DELETE CASCADE) ;
            CREATE TABLE nextSteps(step_id SERIAL PRIMARY KEY,toDo VARCHAR(30) NOT NULL,notes TEXT,context VARCHAR(50),milestone_name VARCHAR(50) REFERENCES milestones ON DELETE CASCADE) ;    
            CREATE TABLE participate(nickname VARCHAR(20) REFERENCES users ON DELETE CASCADE,project_id INTEGER REFERENCES project ON DELETE CASCADE, PRIMARY KEY (nickname,project_id));
            `;
    //TODO: something with the responsible table doesnt work

    try {
        await client.query(queryP)
        console.log("Table created successfully ...")
    } catch (err) {
        console.log(err)
    }


    // Befüllen der Tabellen
    const users = [
        ["dingens", "lkadjliwelj"],
        ["dingsda", "alkdsfjösdfk"]
    ];

    const projects = [
        ["Webseite erstellen", "PEAN-Stack Webseite erstellen", "2024-03-26"],
        ["irgendwas anderes", "Reactive tertiary complexity", "2023-01-20"]
    ];

    const milestones = [
        ['Frontend', 'toDo', 1],
        ['Backend', 'toDo', 1]
        ];

    const nextSteps = [
        ['Wireframe', 'in wwww.mockflow.com zeichnen', 'internet', 'Frontend'],
        ['Angular', 'Angluar Boilerplate anlegen', 'computer', 'Frontend']
    ];

    const participate = [
        ['dingens', '1'],
        ['dingsda', '2']
    ];
    
    // hierfuer muss pg-format installiert werden (wegen %L):
    const usersquery = format('INSERT INTO users(nickname, password) VALUES %L RETURNING *', users);
    const projectquery = format('INSERT INTO project(project_name, topic, deadline) VALUES %L RETURNING *', projects);
    const milestonequery = format('INSERT INTO milestones(milestone_name, status, project_id) VALUES %L RETURNING *', milestones);
    const nextStepsquery = format('INSERT INTO nextSteps(todo, notes, context, milestone_name) VALUES %L RETURNING *', nextSteps);
    const participatequery = format('INSERT INTO participate(nickname, project_id) VALUES %L RETURNING *', participate);


    try {
        const usersresult = await client.query(usersquery)
        console.log("users inserted ...")
        const projectsresult = await client.query(projectquery)
        console.log("projects inserted ...")
        const milestoneresult = await client.query(milestonequery)
        console.log("milestones inserted ...")
        const nextStepsresult = await client.query(nextStepsquery)
        console.log("nextSteps inserted ...")
        const participatesresult = await client.query(participatequery)
        console.log("participate inserted ...")
        res.status(200)
        //TODO: lieber als Object project: project.... als als Array
        res.send([ usersresult.rows, projectsresult.rows, milestoneresult.rows, nextStepsresult.rows, participatesresult.rows])
    } catch (err) {
        console.log(err)
    }

});


module.exports = initdb;
