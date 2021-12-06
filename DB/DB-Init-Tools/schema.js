//schema.js - module that creates table to initialize typetracer db
async function createSchema(db) {
  try {
    await db.schema.createTable('Author', function (table) {
      table.increments('id');//pk default
      table.string('author', 120).unique().notNullable();
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
    await db.schema.createTable('Category', function (table) {
      table.increments('id');//pk default
      table.string('category', 120).unique().notNullable();
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
    await db.schema.createTable('User', function (table) {
      table.increments('id');//pk default
      table.string('name', 40).notNullable();
      table.string('email', 150).unique().notNullable();
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
    await db.schema.createTable('Login', function (table) {
      table.increments('id');//pk default
      table.string('email', 150).unique().notNullable();
      table.string('hash', 100).notNullable();
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
    await db.schema.createTable('Text', function (table) {
      table.integer('id').primary();//pk default
      table.string('title', 600).notNullable();
      table.specificType('pages', 'smallInt').notNullable();
      table.integer('author_id').references('id').inTable("Authors");
      table.integer('category_id').references('id').inTable("Categories");
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
    await db.schema.createTable('User_Text', function (table) {
      table.integer('u_id').references('id').inTable("Users").onDelete("CASCADE"); // if user del no need to keep records
      table.integer('t_id').references('id').inTable("Texts");//no cascade, yet
      table.primary(['u_id','t_id']);//composite primary
      table.specificType('progress','json').notNullable();
      table.integer('last_accessed').notNullable();  
      table.timestamp("created_at").defaultTo(db.fn.now()); 
    });
    console.log('created typetracer schema!');
   }
   catch(err) {
    console.log(err);
   }
}

module.exports= {
  createSchema: createSchema
};