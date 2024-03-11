const express = require('express');
const client = require('./db');
const initdb = express.Router();
const format = require('pg-format');
const bcrypt = require('bcrypt')


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
            CREATE TABLE project(project_id serial PRIMARY KEY, project_name VARCHAR(50), topic TEXT, deadline DATE DEFAULT CURRENT_DATE);
            CREATE TABLE milestones(milestone_name VARCHAR(50) PRIMARY KEY,status VARCHAR(30),project_id INTEGER REFERENCES project ON DELETE CASCADE) ;
            CREATE TABLE nextSteps(step_id SERIAL PRIMARY KEY,toDo VARCHAR(30) NOT NULL,notes TEXT,context VARCHAR(50),milestone_name VARCHAR(50) REFERENCES milestones ON DELETE CASCADE) ;    
            CREATE TABLE participate(nickname VARCHAR(20) REFERENCES users ON DELETE CASCADE,project_id INTEGER REFERENCES project ON DELETE CASCADE, PRIMARY KEY (nickname,project_id));
            CREATE TABLE responsible(nickname VARCHAR(20) REFERENCES users ON DELETE CASCADE,step_id INTEGER REFERENCES nextSteps ON DELETE CASCADE, PRIMARY KEY (nickname,step_id));
            `;

    try {
        await client.query(queryP)
        console.log("Table created successfully ...")
    } catch (err) {
        console.log(err)
    }


    // Befüllen der Tabellen
    let users = [
        ["Dingsda", await bcrypt.hash("dasistdasPasswort", 10)],
        ["Einar.Hartmann", await bcrypt.hash("lkadjliwelj", 10)]
    ];

    const projects = [
        ["Webseite erstellen", "Diverse impactful internet solution", "2024-03-26"],
        ["Versatile systemic Graphical User Interface", "Reactive tertiary complexity", "2025-01-20"]
    ];

    const milestones = [
        ['Frontend', 'in Progress', 1],
        ['Backend', 'done', 1]
        ];

    const nextSteps = [
        ['orchestrate', 'Clone high-level circuit', 'internet', 'Backend'],
        ['reintermediate', 'create Angluar Boilerplate for visionary mobile knowledge user', 'computer', 'Frontend'],
        ['visualize', 'Extended dedicated Frontend', 'computer', 'Frontend'],
        ['Reintermediate', 'innovate visionary empowering architecture', 'computer', 'Backend']
    ];

    const participate = [
        ['Dingsda', '1'],
        ['Einar.Hartmann', '2']
    ];

    const responsible = [
        ['Dingsda', '1'],
        ['Einar.Hartmann', '1'],
        ['Dingsda', '2']
    ]
    
    // hierfuer muss pg-format installiert werden (wegen %L):
    const usersquery = format('INSERT INTO users(nickname, password) VALUES %L RETURNING *', users);
    const projectquery = format('INSERT INTO project(project_name, topic, deadline) VALUES %L RETURNING *', projects);
    const milestonequery = format('INSERT INTO milestones(milestone_name, status, project_id) VALUES %L RETURNING *', milestones);
    const nextStepsquery = format('INSERT INTO nextSteps(todo, notes, context, milestone_name) VALUES %L RETURNING *', nextSteps);
    const participatequery = format('INSERT INTO participate(nickname, project_id) VALUES %L RETURNING *', participate);
    const responsiblequery = format('INSERT INTO responsible(nickname, step_id) VALUES %L RETURNING *', responsible);

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
        const responsibleresult = await client.query(responsiblequery)
        console.log("responsible inserted ...")
        res.status(200)
        //TODO: lieber als Object project: project.... als als Array
        res.send([ usersresult.rows, projectsresult.rows, milestoneresult.rows, nextStepsresult.rows, participatesresult.rows, responsibleresult.rows])
    } catch (err) {
        console.log(err)
    }

});


module.exports = initdb;
