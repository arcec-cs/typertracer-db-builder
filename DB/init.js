// init.js - initializes connection to and contents of db typetracer
const knex = require('knex');
const inkSchema = require('./DB-Init-Tools/schema');
const inkInsert = require('./DB-Init-Tools/insert');
pgconfig = {rejectUnauthorized: false }
//initialize connection to postgres db 'typetracer'
const db = knex({
  client: 'pg',
  connection: {
    connectionString: 'your heroku connection string here',
    ssl: pgconfig, 
    // for local config
    // host : '127.0.0.1',
    // user : 'postgres',
    // password : 'test',
    // database : 'typetracer'
  }
});

 inkSchema.createSchema(db) //create schema first
 .then(() => inkInsert.initAll(db))//init data
 .then(()=> console.log("init.js: typetracer Database Intialized !")); //close connection 
 //.then(()=> db.destroy()) errors, manual closing is okay since is a "user run script"