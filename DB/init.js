// init.js - initializes connection to and contents of db ink
const knex = require('knex');
const inkSchema = require('./DB-Init-Tools/schema');
const inkInsert = require('./DB-Init-Tools/insert');

//initialize connection to postgres db 'ink'
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'ink'
  }
});

inkSchema.createSchema(db) //create schema first
 .then(() => inkInsert.initAll(db))//init data
 .then(()=> console.log("init.js: Ink Database Intialized !")); //close connection 
 //.then(()=> db.destroy()) errors, manual closing is okay since is a "user run script"