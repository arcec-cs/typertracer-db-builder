//schema.js - module that creates table to initialize db ink
async function createSchema(db) {
  try {
    await db.schema.createTable('Authors', function (table) {
      table.increments('id');//pk default
      table.string('author', 120).unique().notNullable();
      table.timestamps(false, true);
    });
    await db.schema.createTable('Categories', function (table) {
      table.increments('id');//pk default
      table.string('category', 120).unique().notNullable();
      table.timestamps(false, true);
    });
    await db.schema.createTable('Users', function (table) {
      table.increments('id');//pk default
      table.string('name', 60).notNullable();
      table.string('email', 150).unique().notNullable();
      table.bigInteger('words').notNullable();
      table.specificType('avatar_id', 'smallInt').defaultTo(0);
      table.timestamps(false, true);
    });
    await db.schema.createTable('Login', function (table) {
      table.increments('id');//pk default
      table.string('hash', 100).notNullable();
      table.timestamp('updated_at');
    });
    await db.schema.createTable('Texts', function (table) {
      table.integer('id').primary();//pk default
      table.string('title', 600).notNullable();
      table.integer('words').notNullable();
      table.integer('author_id').references('id').inTable("Authors");
      table.integer('category_id').references('id').inTable("Categories");
      table.timestamps(false, true);
    });
    await db.schema.createTable('User_Texts', function (table) {
      table.integer('u_id').references('id').inTable("Users").onDelete("CASCADE"); // if user del no need to keep records
      table.integer('t_id').references('id').inTable("Texts");//no cascade, yet
      table.primary(['u_id','t_id']);//composite primary
      table.string('progress_marker', 11);
      table.specificType('bookmarks','varChar(11) ARRAY');
      table.integer('words');   
    });
    console.log('created ink schema!');
   }
   catch(err) {
    console.log(err);
   }
}

module.exports= {
  createSchema: createSchema
};